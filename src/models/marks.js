const mongoose = require("mongoose");

const MarksSchema = new mongoose.Schema({
  studentname: {
    type: String,
    required: true,
    trim: true,
  },
  subjects: [
    {
      subjectName: {
        type: String,
        required: true,
        trim: true,
      },
      totalMarks: {
        type: Number,
        required: true,
        default: 100,
      },
      marksObtained: {
        type: Number,
        required: true,
        default: 0,
      },
    },
  ],
});

const Marks = mongoose.model("Marks", MarksSchema);

module.exports = Marks;
