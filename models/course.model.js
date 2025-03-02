const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  s_id: String,
  course_code: [String],
  course_name: String,
  department: {
    type: [String],
    // Convert a non-array value into an array.
    set: v => Array.isArray(v) ? v : [v]
  },
  credits: Number,
  equivalent_to: [String],
  category: String    
}, { 
  collection: 'Courses',
  toObject: { virtuals: true }, 
  toJSON: { virtuals: true } 
});

CourseSchema.virtual('school', {
  ref: 'School',
  localField: 's_id',
  foreignField: 'id',
  justOne: true
});

module.exports = mongoose.model('Course', CourseSchema);
