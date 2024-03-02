const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const SuperAdminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    userName: {
      type: String,
      unique: true,
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
      default: "superadmin"
    },
  },
  {
    timestamps: true,
  }
);

SuperAdminSchema.methods.generateAuthToken = async function () {
  const superAdmin = this;
  //const token = jwt.sign({ _id: superAdmin._id.toString() }, "yourjwtsecret");
  const token = jwt.sign({ _id: superAdmin._id.toString() }, process.env.JWT_SECRET)

  return token;
};

SuperAdminSchema.statics.findByToken = function (id) {
  const superAdmin = this;
  return superAdmin.findById(id);
};

SuperAdminSchema.statics.findByCredentials = async (email, password) => {
  const superAdmin = await SuperAdmin.findOne({ email });

  if (!superAdmin) {
    throw new Error("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, superAdmin.password);

  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  return superAdmin;
};

SuperAdminSchema.pre("save", async function (next) {
  const superAdmin = this;

  if (superAdmin.isModified("password")) {
    superAdmin.password = await bcrypt.hash(superAdmin.password, 8);
  }

  next();
});

const SuperAdmin = mongoose.model("SuperAdmin", SuperAdminSchema);

module.exports = SuperAdmin;
