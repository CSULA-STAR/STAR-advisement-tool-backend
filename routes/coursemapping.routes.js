const router = require('express').Router();

const controller = require('../controllers/coursemapping.controller');

router.get('/', controller.fetchCourseMapping);

module.exports = router;