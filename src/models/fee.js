const mongoose = require("mongoose");
const Student = require("./student");
const Course = require("./courses");

const Schema = mongoose.Schema;

const feeSchema = new Schema({
  student: {
    type: Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  paymentDate: {
    type: Date,
    default: Date.now,
  },
});

const Fee = mongoose.model("Fee", feeSchema);

module.exports = Fee;
