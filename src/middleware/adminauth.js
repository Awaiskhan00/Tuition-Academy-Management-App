const jwt = require("jsonwebtoken");
const Admin = require("../models/admin.js");

const adminauth = async (req, res, next) => {
  try {
    const authorizationHeader = req.header("Authorization");
    //console.log("Authorization Header:", authorizationHeader);

    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
      throw new Error("Authentication failed. Token not provided or in an invalid format.");
    }

    const token = authorizationHeader.replace("Bearer ", "");
    //console.log("Extracted Token:", token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //console.log("Decoded Token:", decoded);

    const foundAdmin = await Admin.findByToken(decoded._id, token);

    if (!foundAdmin) {
      console.error("Admin not found in the database for the provided token.");
      throw new Error("Authentication failed. Admin not found.");
    }

    req.token = token;
    req.admin = foundAdmin;
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

module.exports = adminauth;