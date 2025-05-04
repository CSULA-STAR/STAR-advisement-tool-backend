const DeptReqBlocks = require('../models/deptReqBlocks.model');

exports.getAllDeptReqBlocks = async (req, res) => {
    try {
        const blocks = await DeptReqBlocks.find({});
        res.json(blocks);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching department requirement blocks' });
    }
};