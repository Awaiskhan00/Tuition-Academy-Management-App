const express = require("express");
const router = express.Router();
const Fee = require("../models/fee");
const authPage = require("../middleware/courses");

// POST /fee/pay
router.post("/fee/pay", async (req, res) => {
  const { studentId, courseId, amount } = req.body;

  try {
    const newFeePayment = new Fee({
      student: studentId,
      course: courseId,
      amount,
    });

    const fee = await newFeePayment.save();
    res.json({ fee });
  } catch (error) {
    console.error("Error creating fee payment record:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET /fee/:StudentId
router.get(
  "/fee/:studentId",
  authPage(["teacher", "admin", "superadmin"]),
  async (req, res) => {
    const studentId = req.params.studentId;

    try {
      const fees = await Fee.find({ student: studentId })
        .populate({
          path: "student",
          select: "name",
        })
        .populate({
          path: "course",
          select: "coursename",
        })
        .exec();

      console.log("Fees:", fees); // Add this line for debugging

      res.json({ fees });
    } catch (error) {
      console.error("Error fetching fee payments:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// Get all fee payments for a specific course
router.get(
  "/fee/course/:courseId",
  authPage(["teacher", "admin", "superadmin"]),
  async (req, res) => {
    const courseId = req.params.courseId;

    try {
      // Find all fee payments for the given course ID
      const fees = await Fee.find({ course: courseId })
        .populate({
          path: "student",
          select: "name",
        })
        .populate({
          path: "course",
          select: "coursename",
        })
        .exec();

      console.log("Fees:", fees);

      if (!fees) {
        return res.status(404).json({ error: "No fees found for this course" });
      }

      res.json({ fees });
    } catch (error) {
      console.error("Error fetching fee payments:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);


module.exports = router;
