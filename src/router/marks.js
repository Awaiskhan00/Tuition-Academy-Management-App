const express = require("express");
const router = express.Router();
const Marks = require("../models/marks");
const authPage = require("../middleware/courses");

// POST route to add marks for a student
router.post("/marks/add", authPage(["admin", "teacher"]), async (req, res) => {
  const { studentname, subjects } = req.body;

  try {
    if (!studentname || !subjects || subjects.length === 0) {
      return res
        .status(400)
        .json({ error: "Student name and subjects array are required." });
    }

    for (let subject of subjects) {
      if (
        !subject.subjectName ||
        !subject.totalMarks ||
        !subject.marksObtained
      ) {
        return res
          .status(400)
          .json({
            error:
              "Each subject object must have subjectName, totalMarks, and marksObtained.",
          });
      }
    }

    const marks = new Marks({
      studentname,
      subjects,
    });

    await marks.save();

    res.status(201).send(marks);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

// Get all marks
router.get(
  "/marks",
  authPage(["admin", "teacher", "superadmin"]),
  async (req, res) => {
    try {
      const marks = await Marks.find();
      res.json(marks);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
);

// Update marks by ID
router.patch(
    "/marks/:id",
    authPage(["admin", "teacher", "superadmin"]),
    async (req, res) => {
      const { subjectName, marksObtained } = req.body;
  
      try {
        const marks = await Marks.findById(req.params.id);
  
        if (!marks) {
          return res.status(404).json({ error: "Marks not found" });
        }
  
        const subjectToUpdate = marks.subjects.find(
          (subject) => subject.subjectName === subjectName
        );
  
        if (!subjectToUpdate) {
          return res.status(404).json({ error: "Subject not found in marks" });
        }
  
        subjectToUpdate.marksObtained = marksObtained;
  
        await marks.save();
  
        res.json(marks);
      } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
      }
    }
  );
  


// Delete marks by ID
router.delete(
  "/marks/:id",
  authPage(["admin", "teacher", "superadmin"]),
  async (req, res) => {
    try {
      const marks = await Marks.findByIdAndDelete(req.params.id);
      if (!marks) {
        return res.status(404).json({ error: "Marks not found" });
      }
      res.json({ message: "Marks deleted" });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
