const express = require("express");
const User = require("../models/users");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//register User
router.post("/register", async (req, res) => {
  const user = req.body;

  // Input validation
  if (!user.name || !user.email || !user.password || !user.preferences) {
    return res.status(400).send({ message: "All fields are required" });
  }
  if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(user.email)) {
    return res.status(400).send({ message: "Invalid email format" });
  }
  if (user.password.length < 6) {
    return res
      .status(400)
      .send({ message: "Password must be at least 6 characters long" });
  }
  if (!Array.isArray(user.preferences) || user.preferences.length === 0) {
    return res
      .status(400)
      .send({ message: "Preferences must be a non-empty array" });
  }

  user.password = bcrypt.hashSync(user.password, 10);
  //adding the user in the DB
  const dbUser = await User.create(user);
  res.send({ newUser: dbUser, message: "User created successfully" });
});

//login User
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const dbUser = await User.findOne({ email });
  console.log(dbUser)
  if (!dbUser) {
    return res.status(404).send({ message: "Email not found" });
  }
  const samePassword = await bcrypt.compareSync(password, dbUser.password);
  if (!samePassword) {
    return res.status(404).send({ message: "Password incorrect" });
  }
  const token = jwt.sign(
    {id:dbUser.id, role: dbUser.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
  res.send({ message: "Login successful", token });
});

module.exports = router;
