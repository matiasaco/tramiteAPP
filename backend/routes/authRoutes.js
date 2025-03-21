const express = require("express");
const { register, login } = require("../controllers/authController");
const db = require("../config/db");
const bcrypt = require("bcryptjs");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

module.exports = router;
