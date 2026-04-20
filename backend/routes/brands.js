const express = require('express');
const router = express.Router();
const c = require('../controllers/brandsController');

router.get('/', c.getAll);
router.get('/:id', c.getOne);
router.post('/', c.create);
router.patch('/:id', c.update);
router.delete('/:id', c.remove);

module.exports = router;
