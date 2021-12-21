import express from "express";
const router = express.Router();
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import {
  ValidateLoginInput,
  ValidateRegisterInput,
  ValidateChangePassword,
  ValidateUserUpdate,
  ValidateCreateUserCms,
} from "../utils/validators";
import User from "../models/User";
import verifyToken from "../middleware/auth";
import verifyTokenStaff from "../middleware/staff";
import { getGeoLocation } from "../api/geolocation";
import {
  mailOption,
  mailOptionSendPassword,
  transporter,
} from "../config/nodeMailer";
import { errorCatch } from "../utils/constaints";
import { isCheckPointUser, sendEmail } from "../utils/service";

function generateToken(user) {
  return jwt.sign(
    {
      typeUser: 0,
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
      message: errorCatch,
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
      sendEmail(newUser.email, newUser._id);
      res.json({
        success: true,
        message:
          "Đăng ký tài khoản, mời bạn kiểm tra email để kích hoạt tài khoản.",
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
      message: errorCatch,
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
      if (!user.accept) {
        sendEmail(user.email, user._id);
        return res.json({
          success: false,
          message:
            "Tài khoản của bạn chưa được kích hoạt, vui lòng kiểm tra email để kích hoạt tài khoản này.",
        });
      }
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
      message: errorCatch,
      errors: error.message,
    });
  }
});

router.get("/get-user-by-phone", async (req, res) => {
  try {
    const user = await User.findOne({ phoneNumber: req.query.phoneNumber });
    if (user) {
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
    }
    return res.status(404).json({
      success: false,
      message: "Không tìm thấy khách hàng này",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: errorCatch,
      errors: error.message,
    });
  }
});

router.get("/test/send-email", async (req, res) => {
  try {
    transporter.sendMail(mailOption, function (error, info) {
      res.json({
        message: error || info,
      });
    });
  } catch (error) {}
});

router.get("/accept-token/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    (user.accept = true), await user.save();
    return res.redirect("https://github.com/Cinema-77");
  }
});

router.put("/change-password", verifyToken, async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const user = await User.findById({ _id: req.userId });
    if (user) {
      const match = await bcrypt.compare(oldPassword, user.password);
      const { valid, errors } = ValidateChangePassword(
        oldPassword,
        newPassword,
        confirmPassword,
        match
      );
      if (!valid) {
        return res.json({
          success: false,
          message: "Đổi mật không khẩu thất bại",
          values: {
            errors,
          },
        });
      }
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      user.password = hashedPassword;
      await user.save();
      return res.json({
        success: true,
        message: "Đổi mật khẩu thành công",
      });
    }
    res.json({
      success: false,
      message: "Không tìm user này",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: errorCatch,
      errors: error.message,
    });
  }
});

router.put("/update/:id", verifyTokenStaff, async (req, res) => {
  try {
    const oldUser = await User.findById(req.params.id);
    const {
      email,
      fullName,
      phoneNumber,
      dateOfBirth,
      address,
      hobby,
      male,
      avatar,
    } = req.body;
    let isEmail = false;
    let isPhone = false;
    if (email !== oldUser.email) {
      const checkEmail = await User.findOne({ email: email });
      isEmail = checkEmail ? true : false;
    }
    if (phoneNumber !== oldUser.phoneNumber) {
      const checkPhone = await User.findOne({ phoneNumber: phoneNumber });
      isPhone = checkPhone ? true : false;
    }

    if (oldUser) {
      const { valid, errors } = ValidateUserUpdate(
        isEmail,
        isPhone,
        phoneNumber,
        email,
        fullName,
        address,
        dateOfBirth
      );

      if (!valid) {
        return res.json({
          success: false,
          message: "Sửa khách hàng thất bại",
          errors: errors,
        });
      } else {
        oldUser.email = email;
        oldUser.phoneNumber = phoneNumber;
        oldUser.profile.hobby = hobby;
        oldUser.profile.fullName = fullName;
        oldUser.profile.male = male;
        oldUser.profile.dateOfBirth = dateOfBirth;
        oldUser.profile.address = address;
        oldUser.profile.avatar = avatar;
        await oldUser.save();

        const user = await User.findById(oldUser._id)
          .populate("permission")
          .populate("cinema");

        return res.json({
          success: true,
          message: "Sửa khách hàng thành công",
          values: {
            user: {
              ...user._doc,
              password: undefined,
            },
          },
        });
      }
    }
    return res.json({
      success: false,
      message: "Sửa khách hàng thất bại",
      errors: "Không tìm thấy khách hàng này",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: errorCatch,
      errors: error.message,
    });
  }
});

router.delete("/delete/:id", verifyTokenStaff, async (req, res) => {
  try {
    const checkPoint = await isCheckPointUser(req.params.id);
    if (checkPoint) {
      return res.json({
        success: false,
        message: "Không thể xóa khách hàng có điểm tích lũy",
      });
    } else {
      const user = await User.findById(req.params.id);
      if (user) {
        user.remove();
        return res.json({
          success: true,
          message: "Xóa khách hàng thành công",
          values: {
            user,
          },
        });
      }
      return res.json({
        success: false,
        message: "Xóa khách hàng thất bại",
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: errorCatch,
      errors: error.message,
    });
  }
});

router.post("/create-user-cms", verifyTokenStaff, async (req, res) => {
  try {
    const { email, fullName, phoneNumber, dateOfBirth } = req.body;
    const checkEmail = await User.findOne({ email: email });
    const checkPhone = await User.findOne({ phoneNumber: phoneNumber });
    const isEmail = checkEmail ? true : false;
    const isPhone = checkPhone ? true : false;
    const { valid, errors } = ValidateCreateUserCms(
      isEmail,
      isPhone,
      phoneNumber,
      email,
      fullName,
      dateOfBirth
    );
    if (!valid) {
      res.json({
        success: false,
        message: "Đăng ký tài khoản",
        errors: errors,
      });
    } else {
      const passWord = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(passWord, 12);
      const newUser = new User({
        email,
        password: hashedPassword,
        phoneNumber,
        profile: {
          fullName,
          dateOfBirth,
        },
        moneyPoint: 0,
        point: 0,
        createdAt: new Date().toISOString(),
        accept: true,
      });
      await newUser.save();
      transporter.sendMail(
        mailOptionSendPassword(fullName, email, passWord),
        function (error, info) {}
      );
      res.json({
        success: true,
        message: "Tạo tài khoản khách hàng thành công",
        values: {
          user: {
            ...newUser._doc,
            password: undefined,
          },
        },
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: errorCatch,
      errors: error.message,
    });
  }
});

router.get("/all", async (req, res) => {
  try {
    const users = await User.find().select("-password").populate("permission");
    if (users) {
      return res.json({
        success: true,
        message: "Lấy danh sách khách hàng thành công",
        values: {
          users,
        },
      });
    }
    return res.json({
      success: false,
      message: "Lấy danh sách khách hàng thất bại",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: errorCatch,
      errors: error.message,
    });
  }
});

module.exports = router;
