const router = require('express').Router();

const controller = require('../controllers/course.controller');

// Retrieve a list of all courses.
// GET /courses
router.get('/', controller.getCourses);

// Retrieve a specific course by ID.
// GET /courses/:id
router.get('/:id', controller.getCoursesById);

// Add a course.
// POST /courses
router.post('/', controller.createCourses);

// Remove a course by ID.
// DELETE /courses/:id
router.delete('/:id', controller.deleteCoursesById);

// Update course information by ID.
// PUT /courses/:id
router.put('/:id', controller.updateCoursesById);

module.exports = router;
