const CSULACourses = require('../models/csulaCourse.model');

// Retrieve a list of all CSULA Courses.
// GET /csula-courses
const getCSULACourses = async (req, res) => {
    try {
        const courses = await CSULACourses.find({});
        res.json(courses);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

// Retrieve a specific CSULA Course by ID.
// GET /csula-courses/:id
const getCSULACourseById = async (req, res) => {
    const { id } = req.params;
    try {
        const course = await CSULACourses.findById(id);
        if (course) {
            res.json(course);
        } else {
           res.status(404).json({ error: `No course found by id: ${id}` });
        }
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

// Add a CSULA Course
// POST /csula-courses
const createCSULACourse = async (req, res) => {
    const { body } = req;
    try {
        // Trim and clean course_code array
        if (Array.isArray(body.course_code)) {
            body.course_code = body.course_code
                .map(item => item.trim())
                .filter(item => item !== "");
        }

        // Ensure department follows expected structure
        if (Array.isArray(body.department)) {
            body.department = body.department.map(dept => ({
                id: dept.id?.trim() || "",
                name: dept.name?.trim() || ""
            }));
        }

        // Trim pre_requisite and co_requisite course_code arrays
        if (body.pre_requisite && Array.isArray(body.pre_requisite.course_code)) {
            body.pre_requisite.course_code = body.pre_requisite.course_code
                .map(item => item.trim())
                .filter(item => item !== "");
        }

        if (body.co_requisite && Array.isArray(body.co_requisite.course_code)) {
            body.co_requisite.course_code = body.co_requisite.course_code
                .map(item => item.trim())
                .filter(item => item !== "");
        }

        const courseDoc = new CSULACourses(body);
        const course = await courseDoc.save();
        res.json(course);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

// Remove a CSULA Course by ID.
// DELETE /csula-courses/:id
const deleteCSULACourseById = async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await CSULACourses.findByIdAndDelete(id);
        if (deleted) {
            res.json({ message: 'success', removedCourse: deleted._id });
        } else {
            res.status(404).json({ error: `No course found by id: ${id}` });
        }
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

// Update CSULA Course information by ID.
// PUT /csula-courses/:id
const updateCSULACourseById = async (req, res) => {
    const { id } = req.params;
    const { body } = req;
    try {
        // Ensure department follows expected structure
        if (Array.isArray(body.department)) {
            body.department = body.department.map(dept => ({
                    id: dept.id?.trim() || "",
                    name: dept.name?.trim() || ""
            }));
        }

        // Clean course_code array
        if (Array.isArray(body.course_code)) {
            body.course_code = body.course_code
                .map(item => item.trim())
                .filter(item => item !== "");
        }

        // Clean pre_requisite and co_requisite course_code arrays
        if (body.pre_requisite && Array.isArray(body.pre_requisite.course_code)) {
            body.pre_requisite.course_code = body.pre_requisite.course_code
                .map(item => item.trim())
                .filter(item => item !== "");
        }

        if (body.co_requisite && Array.isArray(body.co_requisite.course_code)) {
            body.co_requisite.course_code = body.co_requisite.course_code
                .map(item => item.trim())
                .filter(item => item !== "");
        }

        // { new: true } returns the updated document.
        const course = await CSULACourses.findByIdAndUpdate(id, body, { new: true });
        if (course) {
            res.json(course);
        } else {
            res.status(404).json({ error: `No course found by id: ${id}` });
        }
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

module.exports = {
getCSULACourses,
getCSULACourseById,
createCSULACourse,
deleteCSULACourseById,
updateCSULACourseById
};
