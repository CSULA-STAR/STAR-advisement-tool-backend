const router = require('express').Router();
const controller = require('../controllers/program.controller');

// Retrieve a list of all programs.
// GET /programs
router.get('/', controller.getPrograms)

// Retrieve a specific program by ID.
// GET  /programs/:id
router.get('/:id', controller.getProgramById);

// Add a program
// POST     /programs
router.post('/', controller.createProgram);

// Remove a program by ID.
// DELETE   /programs/:id
router.delete('/:id', controller.deleteProgramById);

// Update program information by ID.
// PUT  /programs/:id
router.put('/:id', controller.updateProgramById);

module.exports = router;