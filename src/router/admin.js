const express = require("express");
const Admin = require("../models/admin");
const adminauth = require("../middleware/adminauth");
const jwt = require("jsonwebtoken");
const authPage = require("../middleware/courses");

const router = new express.Router();

// Signup route
router.post("/admin", async (req, res) => {
  const admin = new Admin(req.body);

  try {
    await admin.save();
    const token = await admin.generateAuthToken();
    res.status(201).send({ admin, token });
  } catch (e) {
    console.log(e);
    res.status(400).send({ error: e.message });
  }
});

// Signin or login route
router.post("/admin/login", async (req, res) => {
  try {
    const admin = await Admin.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await admin.generateAuthToken();
    res.send({ admin, token });
  } catch (e) {
    console.log(e);
    res.status(400).send({ error: "Invalid email or password" });
  }
});

// logout route
router.post("/admin/logout", async (req, res) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");

    console.log("Received Token:", token);

    const decodedToken = jwt.decode(token);
    console.log("Decoded Token:", decodedToken); // Log decoded token

    const admin = await Admin.findByToken(decodedToken._id);
    console.log("Admin Found:", admin);

    if (!admin) {
      throw new Error("Authentication failed. Admin not found.");
    }

    res.send({ message: "Logout successful" });
  } catch (e) {
    console.error(e);
    res.status(500).send(e);
  }
});

// Read single admin by ID
router.get(
  "/admin/:id",
  adminauth,
  authPage(["superadmin", "admin"]),
  async (req, res) => {
    const adminId = req.params.id;

    try {
      const admin = await Admin.findById(adminId);

      if (!admin) {
        return res.status(404).send({ error: "Admin not found" });
      }

      res.send(admin);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "Internal Server Error" });
    }
  }
);

// Read All Admins route
router.get("/admin", adminauth, authPage(["superadmin"]), async (req, res) => {
  try {
    const admins = await Admin.find({});
    res.send(admins);
  } catch (error) {
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// Update route
router.patch("/admin/me", adminauth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValidOpertion = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOpertion) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    updates.forEach((update) => (req.admin[update] = req.body[update]));
    await req.admin.save();
    res.send(req.admin);
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

// // Delete route
router.delete(
  "/admin/me",
  adminauth,
  authPage(["superadmin", "admin"]),
  async (req, res) => {
    try {
      await req.admin.deleteOne();
      res.send(req.admin);
    } catch (e) {
      console.log(e);
      res.status(500).send(e);
    }
  }
);

module.exports = router;
