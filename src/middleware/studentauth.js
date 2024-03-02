const jwt = require("jsonwebtoken");
const Student = require("../models/student");


const studentauth = async (req, res, next) => {
  try {
    const authorizationHeader = req.header("Authorization");

    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
      throw new Error("Authentication failed. Token not provided or Invalid format.");
    }

    const token = authorizationHeader.replace("Bearer ", "");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const foundStudent = await Student.findByToken(decoded._id, token);

    if (!foundStudent) {
      console.error("Student not found in the database for the provided token.");
      throw new Error("Authentication failed. Student not found.");
    }

    req.token = token;
    req.student = foundStudent;
    next();
  } catch (error) {
    let errorMessage = "Authentication failed. Please provide a valid token.";
    if (error.name === "JsonWebTokenError") {
      errorMessage = "Authentication failed. Invalid token.";
    } else if (error.name === "TokenExpiredError") {
      errorMessage = "Authentication failed. Token expired.";
    }
    console.error(error); 
    res.status(401).send({ error: errorMessage });
  }
};

module.exports = studentauth;
