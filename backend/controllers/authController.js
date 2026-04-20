const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

async function register(req, res, next) {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await prisma.user.create({
      data: { name, email, passwordHash, role },
    });

    res.status(201).json({ id: user.id, name: user.name, role: user.role });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'No account found with this email' });
    }

    if (!user.passwordHash) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    res.json({ name: user.name, role: user.role });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login };
