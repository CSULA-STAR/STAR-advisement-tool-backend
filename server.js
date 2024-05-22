const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const port = 3001;

const corsOptions = {
  origin: "http://localhost:5173",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

const mongoURL = `mongodb+srv://Star:Star1234@cluster0.gsnssvn.mongodb.net/STAR`;
const Schema = mongoose.Schema;

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURL);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Connection to MongoDB failed:", error);
  }
};

const Schools = mongoose.model(
  "School",
  new mongoose.Schema(
    {
      name: String,
      location: String,
    },
    { collection: "Schools" }
  )
);

const Programs = mongoose.model(
  "Program",
  new mongoose.Schema(
    {
      s_id: String,
      name: String,
      department: String,
    },
    { collection: "Programs" }
  )
);

const CSULA_Courses = mongoose.model(
  "CSULA_Course",
  new mongoose.Schema(
    {
      course_code: Array,
      course_name: String,
      department: Array,
      credits: Number,
      category: String,
      block_type: String,
    },
    { collection: "CSULA_Courses" }
  )
);

const Courses = mongoose.model(
  "Course",
  new mongoose.Schema(
    {
      course_code: Array,
      course_name: String,
      department: Array,
      credits: Number,
      category: String,
    },
    { collection: "Courses" }
  )
);

const CourseTypes = mongoose.model(
  "CourseTypes",
  new mongoose.Schema(
    {
      types: [
        {
          id: String,
          name: String,
        },
      ],
    },
    { collection: "course_types" }
  )
);

const blockSchema = new Schema(
  {
    name: String,
    desc: String,
    req_credits: Number,
  },
  { _id: false }
);

const DeptReqBlocks = mongoose.model(
  "DeptReqBlocks",
  new mongoose.Schema(
    {
      name: String,
      dept_id: String,
      blocks: Array,
    },
    { collection: "dept_req_blocks" }
  )
);

module.exports = { connectDB };

app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.send("Hello from Node.js backend!");
});

app.get("/fetch-institutes", async (req, res) => {
  try {
    const allData = await Schools.find({});
    res.json(allData);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching schools" });
  }
});

app.get("/fetch-programs", async (req, res) => {
  const { collegeId } = req.query;
  try {
    const programs = await Programs.find({ s_id: collegeId });
    res.json(programs);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching programs" });
  }
});

// Function to determine block type for a course
async function determineBlockType(course, departmentData) {
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
}

app.get("/fetch-csula-courses", async (req, res) => {
  const { dept } = req.query;
  try {
    const departmentData = await DeptReqBlocks.findOne({ dept_id: dept });
    const csulaCourses = await CSULA_Courses.find({ "department.id": dept });

    const blockWiseCourses = []; // Initialize as array
    const coursesWithoutBlock = [];

    for (const course of csulaCourses) {
      if (course.block_type) {
        const blockType = await determineBlockType(course, departmentData);
        if (blockType) {
          const index = blockWiseCourses.findIndex(
            (block) => block.type === blockType
          );
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
    res
      .status(500)
      .json({ error: "An error occurred while fetching CSULA courses" });
  }
});

app.get("/fetch-all-csula-courses", async (req, res) => {
  const { dept } = req.query;
  try {
    const csulaCourses = await CSULA_Courses.find({ "department.id": dept });
    res.json(csulaCourses);
  } catch (error) {
    console.error("Error fetching CSULA courses:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching CSULA courses" });
  }
});

// New endpoint for fetching courses by s_id
app.get("/fetch-courses", async (req, res) => {
  const { sid } = req.query;
  try {
    const courses = await Courses.find({ s_id: sid });
    res.json(courses);
  } catch (error) {
    console.error("Error fetching courses by s_id:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching courses by s_id" });
  }
});

app.get("/course-types", async (req, res) => {
  try {
    const course_types = await CourseTypes.find({});
    res.json(course_types);
  } catch (error) {
    console.error("Error fetching courses types", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching course types" });
  }
});

app.get("/fetch-req-block-details", async (req, res) => {
  const { dept } = req.query;
  try {
    const departmentData = await DeptReqBlocks.findOne({ dept_id: dept });
    res.json(departmentData);
  } catch (error) {
    console.error("Error fetching Block data courses:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching Block data" });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
  connectDB();
});
