const express = require("express");
require("./db/mongoose");
const superAdmin = require("./router/superAdmin");
const Admin = require("./router/admin");
const Teacher = require("./router/teacher");
const Student = require("./router/student");
const Course = require("./router/courses");
const Marks = require("./router/marks");
const Attendance = require("./router/attendance");
const Fee = require("./router/fee")


const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use("/api", superAdmin);
app.use("/api", Admin);
app.use("/api", Student);
app.use("/api", Teacher);
app.use("/api", Course);
app.use("/api", Marks);
app.use("/api", Attendance);
app.use("/api", Fee)

app.listen(port, () => {
  console.log("Server is up on port " + port);
});
