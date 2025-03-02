const mongoose = require('mongoose');

const CSULACourseSchema = new mongoose.Schema({
    course_code: Array,
    course_name: String,
    department: Array,
    credits: Number,
    category: String,
    block_type: String
}, { collection: 'CSULA_Courses' });

module.exports = mongoose.model('CSULA_Course', CSULACourseSchema);