const express = require('express');
const router = express.Router();
const controller = require('../controllers/api.controller');


router.get('/fetch-institutes', controller.fetchInstitutes);
router.get('/fetch-programs', controller.fetchPrograms);
router.get('/fetch-csula-courses', controller.fetchCSULACourses);
router.get('/fetch-all-csula-courses', controller.fetchAllCSULACourses);
router.get('/fetch-courses', controller.fetchCoursesBySId);
router.get('/course-types', controller.fetchCourseTypes);
router.get('/fetch-req-block-details', controller.fetchReqBlockDetails);




module.exports = router;
