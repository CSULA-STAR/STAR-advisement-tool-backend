const CSULA_Courses = require('../models/csulaCourse.model');
const CourseTypes = require('../models/courseTypes.model');
const DeptReqBlocks = require('../models/deptReqBlocks.model');
const Schools = require('../models/school.model');
const Programs = require('../models/program.model');
const Courses = require('../models/course.model');

const fetchInstitutes = async (req, res) => {
    try {
        const allData = await Schools.find({});
        res.json(allData);
    } catch (error) {
        res.status(500).json({ error: "An error occurred while fetching schools" });
    }
};

const fetchPrograms = async (req, res) => {
    const { collegeId } = req.query;
    try {
        const programs = await Programs.find({ s_id: collegeId });
        res.json(programs);
    } catch (error) {
        res.status(500).json({ error: "An error occurred while fetching programs" });
    }
};

// Function to determine block type for a course
const determineBlockType = async (course, departmentData) => {
    try {
        if (departmentData && departmentData.blocks) {
            for (const block of departmentData.blocks) {
                if (course.block_type && course.block_type === block.block_id) {
                    return block.block_id;
                }
            }
        }
    } catch (error) {
        console.error("Error determining block type:", error);
    }
    return null;
};

const fetchCSULACourses = async (req, res) => {
    const { dept } = req.query;
    try {
        const departmentData = await DeptReqBlocks.findOne({ dept_id: dept });
        const csulaCourses = await CSULA_Courses.find({ "department.id": dept });

        const blockWiseCourses = [];
        const coursesWithoutBlock = [];

        for (const course of csulaCourses) {
            if (course.block_type) {
                const blockType = await determineBlockType(course, departmentData);
                if (blockType) {
                    const index = blockWiseCourses.findIndex((block) => block.type === blockType);
                    if (index === -1) {
                        blockWiseCourses.push({ type: blockType, course: [course] });
                    } else {
                        blockWiseCourses[index].course.push(course);
                    }
                } else {
                    coursesWithoutBlock.push(course);
                }
            } else {
                coursesWithoutBlock.push(course);
            }
        }

        res.json({ blockWiseCourses, coursesWithoutBlock });
    } catch (error) {
        console.error("Error fetching CSULA courses:", error);
        res.status(500).json({ error: "An error occurred while fetching CSULA courses" });
    }
};

const fetchAllCSULACourses = async (req, res) => {
    const { dept } = req.query;
    try {
        const csulaCourses = await CSULA_Courses.find({ "department.id": dept });
        res.json(csulaCourses);
    } catch (error) {
        console.error("Error fetching CSULA courses:", error);
        res.status(500).json({ error: "An error occurred while fetching CSULA courses" });
    }
};

const fetchCoursesBySId = async (req, res) => {
    const { sid } = req.query;
    try {
        const courses = await Courses.find({ s_id: sid });
        res.json(courses);
    } catch (error) {
        console.error("Error fetching courses by s_id:", error);
        res.status(500).json({ error: "An error occurred while fetching courses by s_id" });
    }
};

const fetchCourseTypes = async (req, res) => {
    try {
        const course_types = await CourseTypes.find({});
        res.json(course_types);
    } catch (error) {
        console.error("Error fetching course types", error);
        res.status(500).json({ error: "An error occurred while fetching course types" });
    }
};

const fetchReqBlockDetails = async (req, res) => {
    const { dept } = req.query;
    try {
        const departmentData = await DeptReqBlocks.findOne({ dept_id: dept });
        res.json(departmentData);
    } catch (error) {
        console.error("Error fetching Block data courses:", error);
        res.status(500).json({ error: "An error occurred while fetching Block data" });
    }
};

module.exports = {
    fetchInstitutes,
    fetchPrograms,
    fetchCSULACourses,
    fetchAllCSULACourses,
    fetchCoursesBySId,
    fetchCourseTypes,
    fetchReqBlockDetails
};
