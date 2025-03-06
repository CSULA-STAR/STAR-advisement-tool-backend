const mongoose = require('mongoose');

const CSULACourseSchema = new mongoose.Schema({
    course_code: [String], // Array of course codes
    course_name: String,   // Course name
    credits: Number,       // Number of credits
    department: [          // Array of department objects
        {
            id: String,
            name: String
        }
    ],
    co_requisite: {        // Co-requisite information
        course_code: [String],
        description: String
    },
    pre_requisite: {       // Pre-requisite information
        course_code: [String],
        description: String
    },
    course_type: String,   // Course type (e.g., lower_division)
    isPreAndCoreqAreSame: Boolean, // Boolean to check if pre-req and co-req are the same
    term: [String]         // Array of terms (e.g., Fall, Spring, Summer)
}, { collection: 'CSULA_Courses' });

module.exports = mongoose.model('CSULA_Course', CSULACourseSchema);
