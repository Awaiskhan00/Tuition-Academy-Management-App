const jwt = require('jsonwebtoken');
const Teacher = require('../models/teacher');
const Student = require('../models/student');

const authPage1 = (allowedRoles) => {
    return (req, res, next) => {
      const token = req.header('Authorization').replace('Bearer ', '');
  
      if (!token) {
        return res.status(401).json({ error: 'Token not provided' });
      }
  
      try {
        const decoded = jwt.verify(token, 'your_secret_key_here');
        req.user = decoded;
        if (!allowedRoles.includes(req.user.role)) {
          return res.status(403).json({ error: 'Unauthorized' });
        }
        next();
      } catch (error) {
        console.error(error);
        res.status(401).json({ error: 'Invalid Token' });
      }
    };
  };
  
module.exports = authPage1;