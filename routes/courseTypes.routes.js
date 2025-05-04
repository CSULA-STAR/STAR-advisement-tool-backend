const courseTypesRouter = express.Router();
const courseTypesController = require('../controllers/courseTypes.controller');

courseTypesRouter.get('/', courseTypesController.getAllCourseTypes);

module.exports = courseTypesRouter;
