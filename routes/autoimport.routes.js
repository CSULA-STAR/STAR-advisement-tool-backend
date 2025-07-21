const router = require('express').Router();

const controller = require('../controllers/autoimport.controller');

// GET /api/autoimport
router.get('/', controller.autoimport);

// POST /api/autoimport/courses
router.post('/courses', controller.coursesimport);

module.exports = router;