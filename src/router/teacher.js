const express = require("express");
const Teacher = require("../models/teacher");
const Course = require("../models/courses");
const teacherauth = require("../middleware/teacherauth");
const jwt = require("jsonwebtoken");
const authPage = require("../middleware/courses")

const router = new express.Router();

// Signup route
router.post("/teacher", async (req, res) => {
  const teacher = new Teacher(req.body);

  try {
    await teacher.save();
    const token = await teacher.generateAuthToken();
    res.status(201).send({ teacher, token });
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

// Signin or login route
router.post("/teacher/login", async (req, res) => {
  try {
    const teacher = await Teacher.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await teacher.generateAuthToken();
    res.send({ teacher, token });
  } catch (e) {
    console.log(e);
    res.status(400).send({ error: "Invalid email or password" });
  }
});

// Logout route
router.post("/teacher/logout", async (req, res) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decodedToken = jwt.decode(token);
    const teacher = await Teacher.findByToken(decodedToken._id);

    if (!teacher) {
      throw new Error("Authentication failed. Teacher not found.");
    }

    res.send({ message: "Logout successful" });
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});


// Read courses taught by the teacher along with enrolled students
router.get("/teacher/courses", teacherauth, async (req, res) => {
  const teacher = req.teacher;

  try {
    // Find all courses where the teacher's ID matches the teacher field
    const courses = await Course.find({ teacher: teacher._id }).populate('students', 'name');

    res.send(courses);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// Read single Teacher by ID
router.get(
  "/teacher/:id",
  teacherauth,
  authPage(["superadmin", "teacher"]),
  async (req, res) => {
    const teacherId = req.params.id;

    try {
      const teacher = await Teacher.findById(teacherId);

      if (!teacher) {
        return res.status(404).send({ error: "Teacher not found" });
      }

      res.send(teacher);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "Internal Server Error" });
    }
  }
);

// //Read route
// router.get("/teacher/me", teacherauth, async (req, res) => {
//   res.send(req.teacher);
// });

// Read All Teachers route
router.get("/teachers", teacherauth, authPage(["superadmin", "admin"]), async (req, res) => {
  try {
    const teachers = await Teacher.find({});
    res.send(teachers);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// Update route
router.patch("/teacher/me", teacherauth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValidOpertion = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOpertion) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    updates.forEach((update) => (req.teacher[update] = req.body[update]));
    await req.teacher.save();
    res.send(req.teacher);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Delete route
router.delete("/teacher/me", teacherauth, async (req, res) => {
  try {
    await req.teacher.deleteOne();
    res.send(req.teacher);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

module.exports = router;
