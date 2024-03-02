const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const StudentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid");
        }
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 7,
      trim: true,
      validate(value) {
        if (value.toLowerCase().includes("password")) {
          throw new Error('Password cannot contain "password"');
        }
      },
    },
    age: {
      type: Number,
      default: 0,
      validate(value) {
        if (value < 0) {
          throw new Error("Age must be a positive number");
        }
      },
    },
    role: {
      type: String,
      required: true,
      trim: true,
      enum: ['admin', 'superadmin', 'teacher', 'student'],
      default: "student"
    }
  },
  {
    timestamps: true,
  }
);

StudentSchema.methods.generateAuthToken = async function () {
  const student = this;
  const token = jwt.sign({ _id: student._id.toString() }, process.env.JWT_SECRET);

  return token;
};

StudentSchema.statics.findByToken = function (id) {
  const student = this;
  return student.findById(id);
};

StudentSchema.statics.findByCredentials = async (email, password) => {
  const student = await Student.findOne({ email });

  if (!student) {
    throw new Error("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, student.password);

  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  return student;
};

StudentSchema.pre("save", async function (next) {
  const student = this;

  if (student.isModified("password")) {
    student.password = await bcrypt.hash(student.password, 8);
  }

  next();
});

const Student = mongoose.model("Student", StudentSchema);

module.exports = Student;
