const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getAll(req, res, next) {
  try {
    const { brandId, status } = req.query;
    const where = {};
    if (brandId) where.brandId = Number(brandId);
    if (status) where.status = status.toUpperCase();

    const campaigns = await prisma.campaign.findMany({
      where,
      orderBy: { startDate: 'desc' },
      include: { brand: true },
    });
    res.json(campaigns);
  } catch (err) {
    next(err);
  }
}

async function getOne(req, res, next) {
  try {
    const campaign = await prisma.campaign.findUnique({
      where: { id: Number(req.params.id) },
      include: { brand: true },
    });
    if (!campaign) return res.status(404).json({ error: 'Campaign not found' });
    res.json(campaign);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const campaign = await prisma.campaign.create({ data: req.body });
    res.status(201).json(campaign);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const campaign = await prisma.campaign.update({
      where: { id: Number(req.params.id) },
      data: req.body,
    });
    res.json(campaign);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    await prisma.campaign.delete({ where: { id: Number(req.params.id) } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, getOne, create, update, remove };
