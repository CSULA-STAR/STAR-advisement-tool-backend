const mongoose = require('mongoose');

const DeptReqBlocksSchema = new mongoose.Schema({
    name: String,
    dept_id: String,
    blocks: Array
}, { collection: 'dept_req_blocks' });

module.exports = mongoose.model('DeptReqBlocks', DeptReqBlocksSchema);