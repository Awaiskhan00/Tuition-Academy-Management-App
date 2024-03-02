const express = require("express");
const Student = require("../models/student");
const Course = require("../models/courses");
//const auth = require("../middleware/auth");
const studentauth = require("../middleware/studentauth");
const jwt = require("jsonwebtoken");
const authPage = require("../middleware/courses")

const router = new express.Router();

// Signup route
router.post("/student", async (req, res) => {
  const student = new Student(req.body);

  try {
    await student.save();
    const token = await student.generateAuthToken();
    res.status(201).send({ student, token });
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

// Signin or login route
router.post("/student/login", async (req, res) => {
  try {
    const student = await Student.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await student.generateAuthToken();
    res.send({ student, token });
  } catch (e) {
    console.log(e);
    res.status(400).send({ error: "Invalid email or password" });
  }
});

// Logout route
router.post("/student/logout", studentauth, async (req, res) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decodedToken = jwt.decode(token);
    const student = await Student.findByToken(decodedToken._id);
    
    if (!student) {
      throw new Error("Authentication failed. Student not found.");
    }

    res.send({ message: "Logout successful" });
  } catch (e) {
    res.status(500).send(e);
  }
});


// Read enrolled courses for a student
router.get("/student/courses", studentauth, async (req, res) => {
  try {
    const student = req.student;

    // Find all courses where the student's ID is in the students array
    const courses = await Course.find({ students: student._id }).populate(
      "teacher",
      "name"
    );

    res.send(courses);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// Check if student is enrolled in a specific course
router.get("/student/courses/:courseId/check", studentauth, async (req, res) => {
  const student = req.student;
  const courseId = req.params.courseId;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).send({ error: "Course not found" });
    }

    const isEnrolled = course.students.includes(student._id);
    res.send({ enrolled: isEnrolled, course });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});


// Read single Student by ID
router.get(
  "/student/:id",
  studentauth,
  authPage(["admin", "superadmin", "teacher"]),
  async (req, res) => {
    const studentId = req.params.id;

    try {
      const student = await Student.findById(studentId);

      if (!student) {
        return res.status(404).send({ error: "Student not found" });
      }

      res.send(student);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "Internal Server Error" });
    }
  }
);

// //Read route
// router.get("/student/me", studentauth, async (req, res) => {
//   res.send(req.student);
// });

// Read All Students route
router.get("/student", studentauth, authPage(["admin", "superadmin"]), async (req, res) => {
  try {
    const students = await Student.find({});
    res.send(students);
  } catch (error) {
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// Update route
router.patch("/student/me", studentauth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValidOpertion = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOpertion) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    updates.forEach((update) => (req.student[update] = req.body[update]));
    await req.student.save();
    res.send(req.student);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Delete route
router.delete("/student/me", studentauth, async (req, res) => {
  try {
    await req.student.deleteOne();
    res.send(req.student);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

module.exports = router;
