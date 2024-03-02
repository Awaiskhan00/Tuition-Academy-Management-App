const express = require("express");
const SuperAdmin = require("../models/superAdmin");
const superAdminauth = require("../middleware/superauth");
const jwt = require("jsonwebtoken");

const router = new express.Router();

// Signup route
router.post("/superAdmin", async (req, res) => {
  const superAdmin = new SuperAdmin(req.body);

  try {
    await superAdmin.save();
    const token = await superAdmin.generateAuthToken();
    res.status(201).send({ superAdmin, token });
  } catch (e) {
    console.log(e);
    res.status(400).send({ error: e.message });
  }
});

// Signin or login route
router.post("/superAdmin/login", async (req, res) => {
  try {
    const superAdmin = await SuperAdmin.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await superAdmin.generateAuthToken();
    res.send({ superAdmin, token });
  } catch (e) {
    console.log(e);
    res.status(400).send({ error: "Invalid email or password" });
  }
});

// Logout route
router.post("/superAdmin/logout", async (req, res) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decodedToken = jwt.decode(token);
    const superAdmin = await SuperAdmin.findByToken(decodedToken._id);
    
    if (!superAdmin) {
      throw new Error("Authentication failed. SuperAdmin not found.");
    }

    res.send({ message: "Logout successful" });
  } catch (e) {
    console.log(e)
    res.status(500).send(e);
  }
});

// Read route
router.get("/superAdmin/me", superAdminauth, async (req, res) => {
  res.send(req.superAdmin); 
});

// Update route
router.patch("/superAdmin/me", superAdminauth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValidOpertion = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOpertion) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    updates.forEach((update) => (req.superAdmin[update] = req.body[update]));
    await req.superAdmin.save();
    res.send(req.superAdmin);
  } catch (e) {
    console.error(e);
    res.status(400).send(e);
  }
});

// Delete route
router.delete("/superAdmin/me", superAdminauth, async (req, res) => {
  try {
    await req.superAdmin.deleteOne();
    res.send(req.superAdmin);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

module.exports = router;

