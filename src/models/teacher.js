const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const TeacherSchema = new mongoose.Schema(
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
      default: "teacher"
    }
  },
  {
    timestamps: true,
  }
);

TeacherSchema.methods.generateAuthToken = async function () {
  const teacher = this;
  const token = jwt.sign({ _id: teacher._id.toString() }, process.env.JWT_SECRET);

  return token;
};

TeacherSchema.statics.findByToken = function (id) {
  const Teacher = this;
  return Teacher.findById(id);
};

TeacherSchema.statics.findByCredentials = async (email, password) => {
  const teacher = await Teacher.findOne({ email });

  if (!teacher) {
    throw new Error("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, teacher.password);

  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  return teacher;
};

TeacherSchema.pre("save", async function (next) {
  const teacher = this;

  if (teacher.isModified("password")) {
    teacher.password = await bcrypt.hash(teacher.password, 8);
  }

  next();
});

const Teacher = mongoose.model("Teacher", TeacherSchema);

module.exports = Teacher;
