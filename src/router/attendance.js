const express = require("express");
const router = express.Router();
const Attendance = require("../models/attendance");
const { checkAttendanceExists } = require("../middleware/attendance");
const authPage = require("../middleware/courses");
const Student = require("../models/student");
const Course = require("../models/courses");

// Create a new attendance record
router.post("/attendance", authPage(["teacher"]), async (req, res) => {
  const { student, course, status, date } = req.body;
  try {
    const attendance = new Attendance({ student, course, status, date });
    await attendance.save();
    res.status(201).json(attendance);
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ error: error.message });
  }
});

// Get all attendance records
router.get(
  "/attendance",
  authPage(["teacher", "admin", "superadmin"]),
  async (req, res) => {
    try {
      const attendance = await Attendance.find()
        .populate("student", "name")
        .populate({
          path: "course",
          select: "coursename",
        })
        .exec();

      res.json(attendance);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
);

// GET attendance record by ID
router.get(
  "/attendance/:studentId",
  authPage(["teacher", "admin", "superadmin"]),
  async (req, res) => {
    const studentId = req.params.studentId;

    try {
      const attendance = await Attendance.find({ student: studentId })
        .populate("student", "name")
        .populate({
          path: "course",
          select: "coursename",
        })
        .exec();

      if (!attendance) {
        return res.status(404).json({ error: "Attendance record not found" });
      }

      res.json({ attendance });
    } catch (error) {
      console.error("Error fetching attendance record:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

module.exports = router;

// // Update attendance record by ID
// router.patch("/attendance/:id", checkAttendanceExists, async (req, res) => {
//   const { student, course, date } = req.body;
//   try {
//     req.attendance.student = student;
//     req.attendance.course = course;
//     req.attendance.date = date;

//     await req.attendance.save();

//     res.json(req.attendance);
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).send("Server Error");
//   }
// });

// Update attendance record by ID
router.patch(
  "/attendance/:id",
  authPage(["admin", "teacher", "admin"]),
  async (req, res) => {
    const { tudent, course, date } = req.body;
    try {
      req.attendance.Student = student;
      req.attendance.Course = course;
      req.attendance.date = date;

      await req.attendance.save();

      res.json(req.attendance);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
);

// Delete attendance record by ID
// router.delete("/attendance/:id", authPage(["superadmin", "admin"]), async (req, res) => {
//   try {
//     await req.attendance.remove();
//     res.json({ message: "Attendance record deleted" });
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).send("Server Error");
//   }
// });

router.delete("/attendance/:id", async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndDelete(req.params.id);
    if (!attendance) {
      return res.status(404).send();
    }
    res.json({ message: "Attendance record deleted" });
    //res.send(attendance);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

module.exports = router;
