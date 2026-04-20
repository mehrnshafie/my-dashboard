const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getAll(req, res, next) {
  try {
    const { channelId } = req.query;
    const where = channelId ? { channelId: Number(channelId) } : {};
    const records = await prisma.analytics.findMany({
      where,
      orderBy: { recordedAt: 'desc' },
      include: { channel: { include: { brand: true } } },
    });
    res.json(records);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const record = await prisma.analytics.create({ data: req.body });
    res.status(201).json(record);
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, create };
