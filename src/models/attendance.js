// const mongoose = require('mongoose');
// const Student = require("../models/student");
// const Course = require("../models/courses")

// const Schema = mongoose.Schema;

// const attendanceSchema = new Schema({
//   student: {
//     type: Schema.Types.ObjectId,
//     ref: 'Student',
//     required: true
//   },
//   course: {
//     type: Schema.Types.ObjectId,
//     ref: 'Course',
//     required: true
//   },
//   date: {
//     type: Date,
//     default: Date.now
//   }
// });

// const Attendance = mongoose.model('Attendance', attendanceSchema);

// module.exports = Attendance;



// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const attendanceSchema = new Schema({
//   student: {
//     _id: {
//       type: Schema.Types.ObjectId,
//       ref: 'User',
//       required: true
//     },
//     name: {
//       type: String,
//       required: true
//     }
//   },
//   course: {
//     type: Schema.Types.ObjectId,
//     ref: 'Course',
//     required: true
//   },
//   date: {
//     type: Date,
//     default: Date.now
//   }
// });

// module.exports = mongoose.model('Attendance', attendanceSchema);







const mongoose = require('mongoose');
const Student = require("../models/student");
const Course = require("../models/courses")

const Schema = mongoose.Schema;

const attendanceSchema = new Schema({
  student: {
    type: Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  status: {
    type: String,
    enum: ['Present', 'Absent', 'Late'],
    default: 'Absent'
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
