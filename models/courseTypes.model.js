const mongoose = require('mongoose');

const CourseTypesSchema = new mongoose.Schema({
    types: [
        {
            id: String,
            name: String
        }
    ]
}, { collection: 'course_types' });

module.exports = mongoose.model('CourseTypes', CourseTypesSchema);