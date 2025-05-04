const deptReqBlocksRouter = express.Router();
const deptReqBlocksController = require('../controllers/deptReqBlocks.controller');

deptReqBlocksRouter.get('/', deptReqBlocksController.getAllDeptReqBlocks);

module.exports = deptReqBlocksRouter;