const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const ok  = (res, data, message = 'OK', status = 200) =>
  res.status(status).json({ success: true,  data, message });

const fail = (res, message, status = 400) =>
  res.status(status).json({ success: false, data: null, message });

// GET /api/social-posts
async function getAll(req, res) {
  try {
    const posts = await prisma.socialPost.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        brand:     { select: { id: true, name: true, slug: true } },
        createdBy: { select: { id: true, name: true, role: true } },
      },
    });
    return ok(res, posts);
  } catch (err) {
    console.error('[socialPosts.getAll]', err);
    return fail(res, 'Database error, please try again', 500);
  }
}

// POST /api/social-posts
async function create(req, res) {
  const { platform, title, brandId, ...rest } = req.body;

  if (!platform) return fail(res, 'Field platform is required');
  if (!title)    return fail(res, 'Field title is required');
  if (!brandId)  return fail(res, 'Field brand_id is required');

  try {
    const post = await prisma.socialPost.create({
      data: { platform, title, brandId: Number(brandId), ...rest },
      include: {
        brand:     { select: { id: true, name: true, slug: true } },
        createdBy: { select: { id: true, name: true, role: true } },
      },
    });
    return ok(res, post, 'Post created', 201);
  } catch (err) {
    console.error('[socialPosts.create]', err);
    return fail(res, 'Database error, please try again', 500);
  }
}

// PUT /api/social-posts/:id
async function update(req, res) {
  const id = Number(req.params.id);

  try {
    const existing = await prisma.socialPost.findUnique({ where: { id } });
    if (!existing) return fail(res, 'Record not found', 404);

    const post = await prisma.socialPost.update({
      where: { id },
      data: req.body,
      include: {
        brand:     { select: { id: true, name: true, slug: true } },
        createdBy: { select: { id: true, name: true, role: true } },
      },
    });
    return ok(res, post, 'Post updated');
  } catch (err) {
    console.error('[socialPosts.update]', err);
    return fail(res, 'Database error, please try again', 500);
  }
}

// DELETE /api/social-posts/:id
async function remove(req, res) {
  const id = Number(req.params.id);

  try {
    const existing = await prisma.socialPost.findUnique({ where: { id } });
    if (!existing) return fail(res, 'Record not found', 404);

    await prisma.socialPost.delete({ where: { id } });
    return ok(res, null, 'Post deleted');
  } catch (err) {
    console.error('[socialPosts.remove]', err);
    return fail(res, 'Database error, please try again', 500);
  }
}

module.exports = { getAll, create, update, remove };
