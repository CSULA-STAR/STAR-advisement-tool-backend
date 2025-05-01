const router = require('express').Router();

const controller = require('../controllers/coursemapping.controller');

router.get('/course-mapping', controller.fetchCourseMapping);

module.exports = router;