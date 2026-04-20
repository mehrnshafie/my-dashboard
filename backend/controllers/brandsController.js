const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getAll(req, res, next) {
  try {
    const brands = await prisma.brand.findMany({
      include: { channels: true },
    });
    res.json(brands);
  } catch (err) {
    next(err);
  }
}

async function getOne(req, res, next) {
  try {
    const brand = await prisma.brand.findUnique({
      where: { id: Number(req.params.id) },
      include: { channels: true, posts: true, campaigns: true },
    });
    if (!brand) return res.status(404).json({ error: 'Brand not found' });
    res.json(brand);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const brand = await prisma.brand.create({ data: req.body });
    res.status(201).json(brand);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const brand = await prisma.brand.update({
      where: { id: Number(req.params.id) },
      data: req.body,
    });
    res.json(brand);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    await prisma.brand.delete({ where: { id: Number(req.params.id) } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, getOne, create, update, remove };
