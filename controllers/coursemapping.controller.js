const CSULA_Courses = require('../models/csulaCourse.model');
const Courses = require('../models/course.model');
const Schools = require('../models/school.model');
const Programs = require('../models/program.model');

const fetchCourseMapping = async (req, res) => {
    const {s_id, dept} = req.query;
    
    // # fetch courses by s_id
    try {
        const list_of_courses = await Courses.find({ 
            s_id : s_id, 
            department: {$in: [dept]}
        }).sort({equivalent_to: 1});
        // get school info and program info for the response json
        const school_info = await Schools.findOne({id: s_id});
        const program_info = await Programs.findOne({s_id: s_id, department: dept});


        const mapping = [];
        
        for (const course of list_of_courses) {
            const arr_equiv = course.equivalent_to
            // ****TODO ===== if arr_equiv is empty or len(arry) == 0 : skip ===== *****
            if (arr_equiv.length == 0) {
                continue;
            }

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

            // TODO ### if len(csula_course) == 0 skip push into mapping
            if (csula_course.length == 0) {
                continue;
            }
            else {
                mapping.push(mapping_course);
            }
        }
        res.json({
            school_id: s_id,
            school_name: school_info.name,
            department_id: dept,
            department_name: program_info.name,
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
