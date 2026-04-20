const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getAll(req, res, next) {
  try {
    const { brandId, platform, status } = req.query;
    const where = {};
    if (brandId) where.brandId = Number(brandId);
    if (platform) where.platform = platform.toUpperCase();
    if (status) where.status = status.toUpperCase();

    const posts = await prisma.post.findMany({ where, orderBy: { createdAt: 'desc' } });
    res.json(posts);
  } catch (err) {
    next(err);
  }
}

async function getOne(req, res, next) {
  try {
    const post = await prisma.post.findUnique({ where: { id: Number(req.params.id) } });
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const post = await prisma.post.create({ data: req.body });
    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const post = await prisma.post.update({
      where: { id: Number(req.params.id) },
      data: req.body,
    });
    res.json(post);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    await prisma.post.delete({ where: { id: Number(req.params.id) } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, getOne, create, update, remove };
