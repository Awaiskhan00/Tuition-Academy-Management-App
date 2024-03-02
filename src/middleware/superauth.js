const jwt = require("jsonwebtoken");
const SuperAdmin = require("../models/superAdmin");


const superAdminauth = async (req, res, next) => {
  try {
    const authorizationHeader = req.header("Authorization");
    console.log("Authorization Header:", authorizationHeader);

    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
      throw new Error("Authentication failed. Token not provided or Invalid format.");
    }

    const token = authorizationHeader.replace("Bearer ", "");
    console.log("Extracted Token:", token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded);

    const foundSuperAdmin = await SuperAdmin.findByToken(decoded._id, token);

    if (!foundSuperAdmin) {
      console.error("SuperAdmin not found in the database for the provided token.");
      throw new Error("Authentication failed. SuperAdmin not found.");
    }

    req.token = token;
    req.superAdmin = foundSuperAdmin;
    next();
  } catch (error) {
    let errorMessage = "Authentication failed. Please provide a valid token.";
    if (error.name === "JsonWebTokenError") {
      errorMessage = "Authentication failed. Invalid token.";
    } else if (error.name === "TokenExpiredError") {
      errorMessage = "Authentication failed. Token expired.";
    }
    console.error(error); // Log the error for further investigation
    res.status(401).send({ error: errorMessage });
  }
};

module.exports = superAdminauth;