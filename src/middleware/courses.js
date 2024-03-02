const Course = require("../models/courses");


// const authPage = (allowedRoles) => {
//   return (req, res, next) => {
//     // Exclude the role check for the /courses POST route
//     // if (req.path === "/courses" && req.method === "POST") {
//     //   return next();
//     // }

//     const { role } = req.body;

//     if (!role) {
//       return res.status(401).json({ error: "Role is required" });
//     }

//     if (!allowedRoles.includes(role)) {
//       return res.status(403).json({ error: "Unauthorized" });
//     }

//     next();
//   };
// };


const authPage = (permissions) => {
  return (req, res, next) => {
    const userRole = req.body.role;
    if (permissions.includes(userRole)) {
      next();
    } else {
      return res.status(401).json("You don't have permission");
    }
  };
};

module.exports = authPage;
