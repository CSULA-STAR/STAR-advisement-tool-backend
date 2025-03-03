const Courses = require('../models/course.model');

// Retrieve a list of all Courses.
// GET /courses
const getCourses = async (req, res) => {
  try {
    const courses = await Courses.find({}).populate('school');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};

// Retrieve a specific Course by ID.
// GET /courses/:id
const getCoursesById = async (req, res) => {
  const { id } = req.params;
  try {
    const course = await Courses.findById(id).populate('school');
    if (course) {
      res.json(course);
    } else {
      res.status(404).json({ error: `No course found by id: ${id}` });
    }
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};

// Add a Course
// POST /courses
const createCourses = async (req, res) => {
  const { body } = req;
  try {
    // Trim and clean course_code array
    if (Array.isArray(body.course_code)) {
      body.course_code = body.course_code
        .map(item => item.trim())
        .filter(item => item !== "");
    }

    // Trim equivalent_to string
    if (Array.isArray(body.equivalent_to)) {
      body.equivalent_to = body.equivalent_to
        .map(item => item.trim())
        .filter(item => item !== "");
    }

    const courseDoc = new Courses(body);
    const course = await courseDoc.save();
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};


// Remove a Course by ID.
// DELETE /courses/:id
const deleteCoursesById = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Courses.findByIdAndDelete(id);
    if (deleted) {
      res.json({ message: 'success', removedCourse: deleted._id });
    } else {
      res.status(404).json({ error: `No course found by id: ${id}` });
    }
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};

// Update Course information by ID.
// PUT /courses/:id
const updateCoursesById = async (req, res) => {
  const { id } = req.params;
  const { body } = req;
  try {
    // { new: true } returns the updated document.
    const course = await Courses.findByIdAndUpdate(id, body, { new: true });
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
  getCourses,
  getCoursesById,
  createCourses,
  deleteCoursesById,
  updateCoursesById
};
