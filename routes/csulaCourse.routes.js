const express = require('express');
const csulaCourseController = require('../controllers/csulaCourse.controller');

const csulaCourseRouter = express.Router();

// Retrieve all CSULA Courses
// GET /csula-courses
csulaCourseRouter.get('/', csulaCourseController.getCSULACourses);

// Retrieve a specific CSULA Course by ID
// GET /csula-courses/:id
csulaCourseRouter.get('/:id', csulaCourseController.getCSULACourseById);

// Add a new CSULA Course
// POST /csula-courses
csulaCourseRouter.post('/', csulaCourseController.createCSULACourse);

// Update an existing CSULA Course by ID
// PUT /csula-courses/:id
csulaCourseRouter.put('/:id', csulaCourseController.updateCSULACourseById);

// Delete a CSULA Course by ID
// DELETE /csula-courses/:id
csulaCourseRouter.delete('/:id', csulaCourseController.deleteCSULACourseById);

module.exports = csulaCourseRouter;
