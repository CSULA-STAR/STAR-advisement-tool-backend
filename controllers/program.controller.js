const Program = require('../models/program.model');
const School = require('../models/school.model');

// Retrieve a list of all programs.
// GET /programs
const getPrograms = async (req, res) => {
    try {
        const program = await Program.find({}).populate('school');
        res.json(program);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

// Retrieve a specific program by ID or s_id.
// GET  /programs/:id
const getProgramById = async (req, res) => {
    const { params, query } = req;
    const id = params.id;

    let program = null;
    try {

        if (id.length === 24) {
            // find by object_id
            program = await Program.find({ _id: id }).populate('school');
        } else {
            // find by s_id
            program = await Program.find({ s_id: id });
        }

        if (program) {
            res.json(program);
        } else {
            res.status(404).json({ error: `No program found by id: ${id}` });
        }
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

// Add a program
// POST     /programs
const createProgram = async (req, res) => {
    const { s_id, name, department } = req.body;

    try {
        // Check if the school with s_id exists
        const schoolExists = await School.findOne({ id: s_id });
        if (!schoolExists) {
            return res.status(400).json({ error: `No school found with ID: ${s_id}` });
        }

        // Create and save the program
        const program = new Program({ s_id, name, department });
        await program.save();
        res.json(program);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

// Remove a program by ID.
// DELETE   /programs/:id
const deleteProgramById = async (req, res) => {
    const { params } = req;
    const id = params.id;

    try {
        const deleted = await Program.findOneAndDelete({ _id: id });

        if (deleted) {
            res.json({ message: 'success', removedProgram: deleted._id });
        } else {
            res.status(404).json({ error: `No program found by id: ${id}` });
        }
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

// Update program information by ID.
// PUT  /programs/:id
const updateProgramById  = async (req, res) => {
    const { params, body } = req;
    const id = params.id;
    const { s_id, name, department } = body;

    try {
        // If `s_id` is provided in update, verify if the school exists
        if (s_id) {
            const schoolExists = await School.findOne({ id: s_id });
            if (!schoolExists) {
                return res.status(400).json({ error: `No school found by id: ${s_id}` });
            }
        }

        // Update the program
        const program = await Program.findOneAndUpdate({ _id: id }, body, {
            new: true
        });

        if (program) {
            res.json(program);
        } else {
            res.status(404).json({ error: `No program found by id: ${id}` });
        }
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

module.exports = {
    getPrograms,
    getProgramById,
    createProgram,
    deleteProgramById,
    updateProgramById
};