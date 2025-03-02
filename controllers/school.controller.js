const School = require('../models/school.model');

// Retrieve a list of all schools.
// GET /schools
const getSchools = async (req, res) => {
    try {
        const school = await School.find({});
        res.json(school);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
        console.log(error);
    }
};

// Retrieve a specific school by ID or s_id.
// GET  /schools/:id
const getSchoolById = async (req, res) => {
    const { params, query } = req;
    const id = params.id;

    let school = null;
    try {
        if (id.length === 24) {
            // find by object_id
            school = await School.findOne({ _id: id });
        } else {
            // find by s_id
            school = await School.findOne({ id: id });
        }
        if (school) {
            res.json(school);
        } else {
            res.status(404).json({ error: `No school found by id: ${id}` });
        }
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

// Add a school
// POST     /schools
const createSchool = async (req, res) => {
    const { body } = req;
    const { name, location } = body;

    try {
        // Check if 'name' is missing or empty
        if (!name || typeof name !== 'string' || name.trim() === "") {
            return res.status(400).json({ error: "Name is required." });
        }

        // Check if a school with the same name already exists
        const existingSchool = await School.findOne({ name });
        if (existingSchool) {
            return res.status(400).json({ error: "The name already exists." });
        }

        // If valid, create a new school
        const schoolDoc = new School({ name, location });
        const school = await schoolDoc.save();

        res.status(201).json(school);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

// Remove a school by ID or s_id.
// DELETE   /schools/:id
const deleteSchoolById = async (req, res) => {
    const { params } = req;
    const id = params.id;

    try {
        let deleted = null;

        if (id.length === 24) {
            // find by object_id
            deleted = await School.findOneAndDelete({ _id: id });
        } else {
            // find by s_id
            deleted = await School.findOneAndDelete({ id: id });
        }

        if (deleted) {
            res.status(200).json({ message: 'Delete success', deletedId: deleted.id  });
        } else {
            res.status(404).json({ error: `No school found by id: ${id}` });
        }
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

// Update school information by ID.
// PUT  /schools/:id
const updateSchoolById  = async (req, res) => {
    const { params, body } = req;
    const id = params.id;

    try {
        // findOneAndUpdate returns the actual mongo document
        // and { new: true } indicates that we get the updated version of the document
        let school = null;

        if (id.length === 24) {
            // find by object_id
            school = await School.findOneAndUpdate({ _id: id }, body, {
                new: true
            });
        } else {
            // find by s_id
            school = await School.findOneAndUpdate({ id: id }, body, {
                new: true
            });
        }

        if (school) {
            res.json(school);
        } else {
            res.status(404).json({ error: `No School found by id: ${id}` });
        }
    } catch (error) {
        res.status(500).json({ error: `Failed to update` });
        console.log(error);
    }
};

module.exports = {
    getSchools,
    getSchoolById,
    createSchool,
    deleteSchoolById,
    updateSchoolById
};