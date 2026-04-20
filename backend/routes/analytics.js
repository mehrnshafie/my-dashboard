const express = require('express');
const router = express.Router();
const c = require('../controllers/analyticsController');

router.get('/', c.getAll);
router.post('/', c.create);

module.exports = router;
