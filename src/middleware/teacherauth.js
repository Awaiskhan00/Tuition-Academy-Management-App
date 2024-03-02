const jwt = require("jsonwebtoken");
const Teacher = require("../models/teacher");

const teacherauth = async (req, res, next) => {
  try {
    const authorizationHeader = req.header("Authorization");

    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
      throw new Error("Authentication failed. Token not provided or in an invalid format.");
    }

    const token = authorizationHeader.replace("Bearer ", "");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const foundTeacher = await Teacher.findByToken(decoded._id, token);

    if (!foundTeacher) {
      console.error("Teacher not found in the database for the provided token.");
      throw new Error("Authentication failed. Teacher not found.");
    }

    req.token = token;
    req.teacher = foundTeacher;
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

module.exports = teacherauth;


// const jwt = require('jsonwebtoken');
// const Teacher = require('../models/teacher');

// const teacherauth = (req, res, next) => {
//   const token = req.header('Authorization').replace('Bearer ', '');

//   if (!token) {
//     return res.status(401).json({ error: 'Token not provided' });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     console.log(decoded); // Log decoded token for debugging
//     req.user = decoded;
//     if (req.user.role !== 'teacher') {
//       return res.status(403).json({ error: 'Unauthorized - Teacher role required' });
//     }
//     next();
//   } catch (error) {
//     console.error(error);
//     res.status(401).json({ error: 'Invalid Token' });
//   }
// };

// module.exports = teacherauth;
