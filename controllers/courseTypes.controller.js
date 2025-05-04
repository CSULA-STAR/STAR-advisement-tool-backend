const CourseTypes = require('../models/courseTypes.model');

exports.getAllCourseTypes = async (req, res) => {
    try {
        const types = await CourseTypes.find({});
        res.json(types);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching course types' });
    }
};