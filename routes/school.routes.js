const router = require('express').Router();

const controller = require('../controllers/school.controller');

// Retrieve a list of all schools.
// GET /schools
router.get('/', controller.getSchools)

// Retrieve a specific school by ID.
// GET  /schools/:id
router.get('/:id', controller.getSchoolById);

// Add a school
// POST     /schools
router.post('/', controller.createSchool);

// Remove a school by ID.
// DELETE   /schools/:id
router.delete('/:id', controller.deleteSchoolById);

// Update school information by ID.
// PUT  /schools/:id
router.put('/:id', controller.updateSchoolById);

module.exports = router;