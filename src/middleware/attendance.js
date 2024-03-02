const Attendance = require('../models/attendance');

// Middleware to check if attendance record exists
const checkAttendanceExists = async (req, res, next) => {
  const { studentId, courseId } = req.body;
  try {
    const attendance = await Attendance.findOne({ student: studentId, course: courseId });
    if (!attendance) {
      return res.status(404).json({ error: "Attendance record not found" });
    }
    req.attendance = attendance;
    next();
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

module.exports = {
  checkAttendanceExists
};
