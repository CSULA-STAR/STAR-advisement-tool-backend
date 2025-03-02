// server.js
const express = require('express');
const cors = require('cors');
const mongo = require('./mongo');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Importing routes
const schoolRoutes = require('./routes/school.routes');
const programRoutes = require('./routes/program.routes');
const courseRoutes = require('./routes/course.routes');
// const csulaCourseRoutes = require('./routes/csulaCourse.routes');
// const deptReqBlocksRoutes = require('./routes/deptReqBlocks.routes');
// const courseTypesRoutes = require('./routes/courseTypes.routes');
const apiRoutes = require('./routes/api.routes');

// Mounting routes
app.use('/api/schools', schoolRoutes);
app.use('/api/programs', programRoutes);
app.use('/api/courses', courseRoutes);
// app.use('/csula-courses', csulaCourseRoutes);
// app.use('/dept-req-blocks', deptReqBlocksRoutes);
// app.use('/course-types', courseTypesRoutes);
app.use('/', apiRoutes);

app.listen(PORT, async () => {
    console.log(`Server is listening on port ${PORT}`);
    await mongo.connectDB();
});
