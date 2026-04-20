require('dotenv').config();
const express = require('express');
const cors = require('cors');

const brandsRouter = require('./routes/brands');
const postsRouter = require('./routes/posts');
const analyticsRouter = require('./routes/analytics');
const campaignsRouter = require('./routes/campaigns');

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/brands', brandsRouter);
app.use('/api/posts', postsRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/campaigns', campaignsRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

module.exports = app;
