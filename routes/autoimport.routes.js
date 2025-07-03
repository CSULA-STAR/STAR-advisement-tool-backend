const router = require('express').Router();

const controller = require('../controllers/autoimport.controller');

// GET /api/autoimport
router.get('/', controller.autoimport);

module.exports = router;