import express from "express";
const router = express.Router();
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { ValidateLoginInput, ValidateRegisterInput } from "../utils/validators";
import User from "../models/User";

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    process.env.SECRET_KEY,
    { expiresIn: "14d" }
  );
}

// @route POST api/auth/register
// @desc Register user
// @access Public
router.post("/register", async (req, res) => {
  const { password, confirmPassword, email, lastName, firstName } = req.body;
  const user = await User.findOne({ email: email });

  const isEmail = user ? true : false;
  const { valid, errors } = ValidateRegisterInput(
    isEmail,
    email,
    password,
    confirmPassword,
    firstName,
    lastName
  );
  if (!valid) {
    res.json({
      success: false,
      message: "Đăng ký tài khoản",
      errors: errors,
    });
  } else {
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      email,
      password: hashedPassword,
      profile: {
        firstName,
        lastName,
      },
      createdAt: new Date().toISOString(),
    });
    const value = await newUser.save();
    const token = generateToken(value);
    res.json({
      success: true,
      message: "Đăng ký tài khoản",
      token: token,
    });
  }
});

// @route POST api/auth/login
// @desc Login user
// @access Public
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });
  const { valid, errors } = ValidateLoginInput(email, password);
  if (!user) {
    if (email !== "") {
      errors.email = "Thông tin tài khoản không tồn tại";
    }
    res.json({
      success: false,
      message: "Đăng nhập",
      errors: errors,
    });
  } else {
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      if (password !== "") {
        errors.password = "Thông tin mật khẩu chưa chính xác";
      }
      res.json({
        success: false,
        message: "Đăng nhập",
        errors: errors,
      });
    } else {
      const token = generateToken(user);
      res.json({
        success: true,
        message: "Đăng nhập",
        token: token,
      });
    }
  }
});

module.exports = router;
