const CSULA_Courses = require('../models/csulaCourse.model');
const Courses = require('../models/course.model');

const fetchCourseMapping = async (req, res) => {
    const {s_id, dept} = req.query;
    
    // # fetch courses by s_id
    try {
        const list_of_courses = await Courses.find({ 
            s_id : s_id, 
            department: {$in: [dept]}
        });
        // # use courseModel.model
        

        const mapping = [];
        
        for (const course of list_of_courses) {
            const arr_equiv = course.equivalent_to

            const csula_course = [];
            // # for loop through the equivalent courses
            for (const equiv of arr_equiv) {
                csula_course.push(equiv);
            }
            
            // # get the course id e.g "ENGR 1500"

            // #search use the course id to get the csula course detail from CSULACourses
            if (csula_course.length > 1) {
                mapping_course = {
                    external_course: {
                        course_code : course.course_code,
                        course_name : course.course_name,
                        course_credits : course.credits
                    },
                    csula_course : [ 
                        
                    ]
                }
                for (const CSULAcourse of csula_course) {
                    csula_result = await CSULA_Courses.findOne({course_code : {$in : [CSULAcourse]}});
                    if (csula_result) {
                        mapping_course.csula_course.push({
                            course_code : csula_result.course_code,
                            course_name : csula_result.course_name, 
                            course_credits : csula_result.credits
                        });
                    }
                }
                console.log(mapping_course);
            }
            else {
                console.log(csula_course[0]);
                csula_result = await CSULA_Courses.findOne({ course_code : {$in : [csula_course[0]]}});
                if (csula_result) {
                    mapping_course = {
                        external_course: {
                            course_code : course.course_code,
                            course_name : course.course_name,
                            course_credits : course.credits
                        },
                        csula_course : [ 
                            {
                                course_code : csula_result.course_code,
                                course_name : csula_result.course_name,
                                course_credits : csula_result.credits
                            }
                        ]
                    }
                }
                else {
                    mapping_course = {
                        external_course: {
                            course_code : course.course_code,
                            course_name : course.course_name,
                            course_credits : course.credits
                        }
                    }
                }
                
            }
            mapping.push(mapping_course);
        }
        res.json({
            school_id: s_id,
            department_id: dept,
            mappings: mapping
        });
    }
    catch (error) {
        console.error("Error fetching mapping: ", error);
        res.status(500).json({error: "Error occured while fetching course mapping"});
    }
    
};

module.exports = {
    fetchCourseMapping
};
