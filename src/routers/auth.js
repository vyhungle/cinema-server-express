import express from "express";
const router = express.Router();
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { ValidateLoginInput, ValidateRegisterInput } from "../utils/validators";
import User from "../models/User";
import verifyToken from "../middleware/auth";
import { getGeoLocation } from "../api/geolocation";

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      phoneNumber: user.phoneNumber,
    },
    process.env.SECRET_KEY,
    { expiresIn: "14d" }
  );
}

// @route GET api/auth/user
// @desc get my user
// @access Private

router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    return res.json({
      success: true,
      message: "Lấy dữ liệu thành công",
      user: {
        ...user._doc,
        password: undefined,
        profile: {
          ...user._doc.profile,
          address: {
            ...user._doc.profile.address,
            lat: undefined,
            lng: undefined,
          },
        },
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Lỗi 400!",
      errors: error.message,
    });
  }
});

// @route POST api/auth/register
// @desc Register user
// @access Public
router.post("/register", async (req, res) => {
  const {
    password,
    confirmPassword,
    email,
    fullName,
    phoneNumber,
    dateOfBirth,
    address,
  } = req.body;
  try {
    const checkEmail = await User.findOne({ email: email });
    const checkPhone = await User.findOne({ phoneNumber: phoneNumber });

    const isEmail = checkEmail ? true : false;
    const isPhone = checkPhone ? true : false;
    const { valid, errors } = ValidateRegisterInput(
      isEmail,
      isPhone,
      phoneNumber,
      email,
      password,
      confirmPassword,
      fullName,
      address,
      dateOfBirth
    );
    if (!valid) {
      res.json({
        success: false,
        message: "Đăng ký tài khoản",
        errors: errors,
      });
    } else {
      const geo = await getGeoLocation(
        `${address.street}, ${address.ward}, ${address.district}, ${address.city}`
      );
      const { lat, lng } = geo.data.results[0].geometry;
      const hashedPassword = await bcrypt.hash(password, 12);
      const newUser = new User({
        email,
        password: hashedPassword,
        phoneNumber,
        profile: {
          fullName,
          dateOfBirth,
          address: { ...address, lat, lng },
        },
        moneyPoint: 0,
        point: 0,
        createdAt: new Date().toISOString(),
      });
      const value = await newUser.save();
      const token = generateToken(value);
      res.json({
        success: true,
        message: "Đăng ký tài khoản",
        values: {
          token: token,
          user: {
            ...newUser._doc,
            password: undefined,
            profile: {
              ...newUser._doc.profile,
              address,
            },
          },
        },
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Lỗi 400!",
      errors: error.message,
    });
  }
});

// @route POST api/auth/login
// @desc Login user
// @access Public
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const checkEmail = await User.findOne({ email: username });
    const checkPhone = await User.findOne({ phoneNumber: username });
    const { valid, errors } = ValidateLoginInput(username, password);
    if (!checkEmail && !checkPhone) {
      if (username !== "") {
        errors.username = "Thông tin tài khoản không tồn tại";
      }
      res.json({
        success: false,
        message: "Đăng nhập",
        errors: errors,
      });
    } else {
      const user = checkEmail ? checkEmail : checkPhone;
      delete user.password;
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
          values: {
            token: token,
            user: {
              ...user._doc,
              password: undefined,
              profile: {
                ...user._doc.profile,
                address: {
                  ...user._doc.profile.address,
                  lat: undefined,
                  lng: undefined,
                },
              },
            },
          },
        });
      }
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Lỗi 400!",
      errors: error.message,
    });
  }
});

router.get("/get-user-by-phone", async (req, res) => {
  try {
    const user = await User.findOne({ phoneNumber: req.query.phoneNumber });
    return res.json({
      success: true,
      message: "Lấy dữ liệu thành công",
      user: {
        ...user._doc,
        password: undefined,
        profile: {
          ...user._doc.profile,
          address: {
            ...user._doc.profile.address,
            lat: undefined,
            lng: undefined,
          },
        },
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Lỗi 400!",
      errors: error.message,
    });
  }
});

module.exports = router;
