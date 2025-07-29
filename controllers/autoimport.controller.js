// GET /
const scrapeAssistData = require('./scrapeAssist.controller');
const Courses = require('../models/course.model');
const CSULACourses = require('../models/csulaCourse.model');
const Schools = require('../models/school.model');
const Programs = require('../models/program.model');

const autoimport = async (req, res) => {
  const { s_id, dept } = req.query;

  if (!s_id || !dept) {
    return res.status(400).json({ error: 'Missing "s_id" or "dept" parameter' });
  }

  try {
    // Look up college name from Schools collection
    const school = await Schools.findOne({ id: s_id });
    if (!school) {
      return res.status(404).json({ error: `School not found with s_id: ${s_id}` });
    }

    // Look up major name from Programs collection
    const program = await Programs.findOne({ s_id: s_id, department: dept });
    if (!program) {
      return res.status(404).json({ error: `Program not found with s_id: ${s_id} and dept: ${dept}` });
    }

    const college = school.name;
    const major = program.name;

    const data = await scrapeAssistData(college, major);
    res.json(data);
  } catch (error) {
    console.error('Scraping error:', error);
    res.status(500).json({ error: 'Failed to fetch course data' });
  }
};
//add sleep 5 sec for each step
//timeout if it gets stuck on some screen
//http response codes


const coursesimport = async (req, res) => {
  try {
    const { mapping, school_id, dept } = req.body;

    // Validate required fields
    if (!mapping || !Array.isArray(mapping)) {
      return res.status(400).json({ error: 'Missing or invalid mapping array' });
    }

    if (!school_id) {
      return res.status(400).json({ error: 'Missing school_id parameter' });
    }

    if (!dept) {
      return res.status(400).json({ error: 'Missing dept parameter' });
    }

    const results = {
      external_courses_created: 0,
      csula_courses_created: 0,
      mappings_created: 0,
      errors: []
    };

    for (const mappingItem of mapping) {
      try {
        const { external_course, csula_course } = mappingItem;

        // Validate external course data
        if (!external_course || !external_course.course_code || !external_course.course_name) {
          results.errors.push(`Invalid external course data: ${JSON.stringify(external_course)}`);
          continue;
        }

        // TODO: Validate CSULA course data


        // Check if external course already exists
        let externalCourseDoc = await Courses.findOne({
          s_id: school_id,
          course_code: { $in: [external_course.course_code] },
          department: { $in: [dept] }
        });

        // Create external course if it doesn't exist
        if (!externalCourseDoc) {
          externalCourseDoc = new Courses({
            s_id: school_id,
            course_code: [external_course.course_code],
            course_name: external_course.course_name,
            department: [dept],
            credits: external_course.credits || 0,
            equivalent_to: [csula_course.course_code], // Link to CSULA course
          });
          await externalCourseDoc.save();
          results.external_courses_created++;
        } else {
          // Update existing course with new equivalent
            const isDuplicate = externalCourseDoc.equivalent_to.some(code => 
              code.toLowerCase() === csula_course.course_code.toLowerCase()
            );
            if (!isDuplicate) {
              externalCourseDoc.equivalent_to.push(csula_course.course_code);
              await externalCourseDoc.save();
            }
          }

        // TODO: Check if CSULA course already exists

        
        // TODO: Create CSULA course if it doesn't exist
        

        results.mappings_created++;

      } catch (error) {
        console.error('Error processing mapping:', error);
        results.errors.push(`Error processing mapping: ${error.message}`);
      }
    }

    res.json({
      message: 'Course import completed',
      results
    });

  } catch (error) {
    console.error('Course import error:', error);
    res.status(500).json({ error: 'Failed to import course data' });
  }
};

module.exports = {
  autoimport,
  coursesimport
};
