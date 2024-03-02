const express = require("express");
const multer = require("multer");
const path = require("path");
const sharp = require("sharp");
const Teacher = require("../models/teacher");
const Student = require("../models/student");
const Course = require("../models/courses");
const authPage = require("../middleware/courses");
const mongoose = require("mongoose");

const router = express.Router();

// Create a new course by admin or superadmin
router.post("/courses", authPage(["admin", "superadmin"]), async (req, res) => {
  try {
    const { coursename, title, description, teacher, students, role } =
      req.body;

    let existingTeacher;
    try {
      existingTeacher = await Teacher.findById(teacher);
    } catch (err) {
      return res.status(400).send({ error: "Invalid teacher ID" });
    }

    if (!existingTeacher) {
      return res.status(400).send({ error: "Teacher not found" });
    }

    const existingStudents = await Student.find({ _id: { $in: students } });
    if (existingStudents.length !== students.length) {
      return res.status(400).send({ error: "One or more students not found" });
    }

    const course = new Course({
      coursename,
      title,
      description,
      teacher: existingTeacher,
      students: existingStudents,
      role,
    });

    await course.save();
    res.status(201).send(course);
  } catch (error) {
    console.error(error);
    res.status(400).send({ error: error.message });
  }
});

// Fetch courses for a teacher or student after login
// router.get('/courses', authPage(['teacher', 'student']), async (req, res) => {
//   try {
//     let courses = [];
//     if (req.user.role === 'teacher') {
//       courses = await Course.find({ teacher: req.user._id }).populate('students', 'name');
//     } else if (req.user.role === 'student') {
//       courses = await Course.find({ students: req.user._id }).populate('teacher', 'name');
//     }

//     res.send(courses);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ error: 'Internal Server Error' });
//   }
// });

// // Create a new course
// router.post(
//   "/courses",
//   authPage(["admin", "superadmin"]),
//   async (req, res) => {
//     const course = new Course(req.body);
//     try {
//       await course.save();
//       res.status(201).send(course);
//     } catch (error) {
//       console.log(error);
//       res.status(400).send(error);
//     }
//   }
// );

// router.post("/courses", async (req, res) => {
//   console.log("Request Body:", req.body); // Log the request body
//   const { coursename, title, description, teacher, students } = req.body;

//   try {
//     const course = new Course({
//       coursename,
//       title,
//       description,
//       teacher,
//       students,
//     });

//     await course.save();
//     res.status(201).json(course);
//   } catch (error) {
//     console.error(error.message);
//     res.status(400).json({ error: error.message });
//   }
// });

// Get all courses with teacher and students populated
router.get("/courses", authPage(["admin", "superadmin"]), async (req, res) => {
  try {
    const courses = await Course.find()
      // .populate("teacher._id", "name")
      // .populate("students._id", "name")

      .populate("teacher", "name")
      .populate("students", "name")
      .exec();

    res.json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

// Read all courses
// router.get(
//   "/courses",
//   authPage(["admin", "teacher", "superadmin"]),
//   async (req, res) => {
//     try {
//       const courses = await Course.find();
//       res.send(courses);
//     } catch (error) {
//       res.status(500).send(error);
//     }
//   }
// );

// Get a single course by ID
router.get(
  "/courses/:id",
  authPage(["admin", "superadmin", "teacher"]),
  async (req, res) => {
    const courseId = req.params.id;

    try {
      const course = await Course.findById(courseId)
        .populate("teacher", "name")
        .populate("students", "name")
        .exec();

      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }

      res.json(course);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server Error" });
    }
  }
);

// update course
router.patch(
  "/courses/:id",
  authPage(["admin", "superadmin"]),
  async (req, res) => {
    const courseId = req.params.id;
    const updates = req.body;

    try {
      // Find the course by ID and update specific fields
      const course = await Course.findByIdAndUpdate(courseId, updates, {
        new: true,
      })

        // For Populate
        .populate("teacher", "name")
        .populate("students", "name")
        .exec();

      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }

      res.json({ course });
    } catch (error) {
      console.error("Error updating course:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// Delete a course by ID
router.delete("/courses/:id", async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).send();
    }
    res.send(course);
  } catch (error) {
    res.status(500).send(error);
  }
});

// const upload = multer({
//   // dest: "avatars",
//   limits: {
//     fileSize: 1000000,
//   },
//   fileFilter(req, file, cb) {
//     if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
//       return cb(new Error("Please upload a file"));
//     }

//     cb(undefined, true);
//   },
// });

// // // Create avatar
// router.post("/courses/me/avatar", authPage(["admin", "teacher", "superadmin"]), upload.single("avatar"), async (req, res) => {
//     try {
//       // Check if the file is present
//       if (!req.file) {
//         return res.status(400).send({ error: "No file uploaded." });
//       }

//       // Use sharp to resize the uploaded image to 250x250 pixels and convert it to PNG format before saving it as a buffer
//       const buffer = await sharp(req.file.buffer)
//         .resize({ width: 250, height: 250 })
//         .png()
//         .toBuffer();

//       // Set the avatar in the user document
//       req.user.avatar = buffer;
//       await req.user.save();

//       res.send();
//     } catch (error) {
//       console.log(error);
//       res.status(500).send(error);
//     }
//   }
// );

// Update course avatar
// router.post(
//   "/courses/me/avatar",
//   upload.single("avatar"),
//   async (req, res) => {
//     req.course.avatar = req.file.buffer;
//     await req.user.save();
//     res.send();
//   },
//   (error, req, res, next) => {
//     res.status(400).send({ error: error.message });
//   }
// );

///////////////////////////////////////////////////////////

// // Storage configuration for multer
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/avatars"); // Uploads folder (create if doesn't exist)
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     const fileExtension = path.extname(file.originalname);
//     cb(null, file.fieldname + "-" + uniqueSuffix + fileExtension);
//   },
// });

// // File filter function to allow only images
// const fileFilter = (req, file, cb) => {
//   if (
//     file.mimetype === "image/jpeg" ||
//     file.mimetype === "image/png" ||
//     file.mimetype === "image/jpg"
//   ) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only JPEG, PNG, and JPG files are allowed!"), false);
//   }
// };

// // Initialize multer with the storage and fileFilter configurations
// const upload = multer({
//   storage: storage,
//   fileFilter: fileFilter,
// });

// // Avatar upload route
// router.post(
//   "/courses/:id/avatar",
//   upload.single("avatar"),
//   async (req, res) => {
//     try {
//       const course = await Course.findById(req.params.id);

//       if (!course) {
//         return res.status(404).json({ error: "Course not found" });
//       }

//       // Update the course's avatar field with the uploaded file path
//       course.avatar = req.file.path;

//       await course.save();
//       res.status(200).json(course);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: "Server Error" });
//     }
//   }
// );

// Storage configuration for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/avatars"); // Uploads folder (create if doesn't exist)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + fileExtension);
  },
});

// File filter function to allow only images
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG, and JPG files are allowed!"), false);
  }
};

// Initialize multer with the storage and fileFilter configurations
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

// Avatar upload route
router.post(
  "/courses/:id/avatar",
  upload.single("avatar"),
  async (req, res) => {
    try {
      const course = await Course.findById(req.params.id);

      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }

      // Update the course's avatar field with the uploaded file path
      course.avatar = req.file.path;

      await course.save();
      res.status(200).json(course);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server Error" });
    }
  }
);

module.exports = router;
