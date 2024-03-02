// const mongoose = require("mongoose");
// const Teacher = require("../models/teacher")
// const Student = require("../models/student")

// const courseSchema = new mongoose.Schema(
//   {
//     coursename: {
//       type: String,
//       trim: true,
//       required: true,
//     },
//     title: {
//       type: String,
//       trim: true,
//       required: true,
//     },
//     description: {
//       type: String,
//       trim: true,
//       required: true,
//     },
//     // role: {
//     //   type: String,
//     //   trim: true,
//     //   enum: ["admin", "superadmin", "teacher"],
//     //   default: "teacher",
//     // },
//     //
//     teacher: {
//       type: {
//         _id: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "Teacher",
//           required: true,
//         },
//         name: {
//           type: String,
//           required: true,
//           trim: true
//         },
//       },
//       required: true,
//     },
//     students: [
//       {
//         _id: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "Student",
//         },
//         name: {
//           type: String,
//           required: true,
//           trim: true
//         },
//       },
//     ],
//     avatar: {
//       type: Buffer,
//     },
//     // grades: [{
//     //     studentId: {
//     //         type: mongoose.Schema.Types.ObjectId,
//     //         ref: 'Student'
//     //     },
//     //     grade: {
//     //         type: Number,
//     //         required: true
//     //     }
//     // }]
//   },
//   {
//     timestamps: true,
//   }
// );

// // Add a method to the Course model to fetch grades by course ID
// courseSchema.statics.fetchGradesByCourseId = async function (courseId) {
//   try {
//     const course = await this.findById(courseId).exec();
//     if (!course) {
//       throw new Error("Course not found");
//     }
//     return course.grades;
//   } catch (error) {
//     console.error("Error fetching grades:", error.message);
//     throw error;
//   }
// };

// const Course = mongoose.model("Course", courseSchema);

// module.exports = Course;

const mongoose = require("mongoose");
const Teacher = require("../models/teacher");
const Student = require("../models/student");

const courseSchema = new mongoose.Schema(
  {
    coursename: {
      type: String,
      trim: true,
      required: true,
    },
    title: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
    },
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
    avatar: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add a method to the Course model to fetch grades by course ID
// courseSchema.statics.fetchGradesByCourseId = async function (courseId) {
//   try {
//     const course = await this.findById(courseId).exec();
//     if (!course) {
//       throw new Error("Course not found");
//     }
//     return course.grades;
//   } catch (error) {
//     console.error("Error fetching grades:", error.message);
//     throw error;
//   }
// };

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
