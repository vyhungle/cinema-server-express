import express from "express";
const router = express.Router();
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import {
  ValidateLoginInput,
  ValidateStaff,
  ValidateChangePassword,
} from "../utils/validators";
import Staff from "../models/Staff";
import verifyToken from "../middleware/staff";
import Invite from "../models/Invite";
import { errorCatch, errorPermission } from "../utils/constaints";
import { mailOptionInvite, transporter } from "../config/nodeMailer";
import md5 from "md5";
import { createDateEX } from "../utils/helper";

function generateToken(staff) {
  return jwt.sign(
    {
      typeUser: 1,
      id: staff.id,
      email: staff.email,
      phoneNumber: staff.phoneNumber,
      type: staff.permission.type,
    },
    process.env.SECRET_KEY,
    { expiresIn: "14d" }
  );
}

// lấy danh sách nhân viên

router.get("/access-token/:token", async (req, res) => {
  const invite = await Invite.findOne({ token: req.params.token });
  if (invite) {
    if (!invite.status) {
      return res.redirect("https://token-da-duoc-kich-hoat-roi/");
    } else if (Date.now() > invite.dateEx) {
      return res.redirect("https://token-het-han/");
    } else {
      // invite.status = false;
      // await invite.save();
      return res.redirect("https://thanh-cong-chuyen-form");
    }
  }
  return res.redirect("https://token-khong-hop-le/");
});

router.post("/send/invite", verifyToken, async (req, res) => {
  const { staffId, type } = req;
  const { email } = req.body;
  try {
    if (type <= 1) {
      const user = await Staff.findById(staffId).populate("cinema");
      const address = `${user.cinema.address.street}, ${user.cinema.address.ward}, ${user.cinema.address.district}, ${user.cinema.address.city}.`;
      const token = md5(email + Date.now());
      const invite = new Invite({
        email,
        token,
        dateEx: createDateEX(10),
      });
      await invite.save();
      transporter.sendMail(
        mailOptionInvite(
          email,
          user.cinema.name,
          address,
          `https://server-api-cinema.herokuapp.com/api/staff/access-token/${token}`
        ),
        function (error, info) {
          if (info) {
            return res.json({
              success: true,
              message: "Gửi thư mời thành công",
            });
          } else {
            return res.json({
              success: false,
              message: "Gửi thư mời thất bại",
              error,
            });
          }
        }
      );
      return res.json({
        success: true,
      });
    }
    return res.json({
      success: false,
      message: errorPermission,
    });
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
    const staffs = await Staff.find()
      .select("-password")
      .populate("permission");
    if (staffs) {
      return res.json({
        success: true,
        message: "Lấy dữ liệu thành công",
        values: {
          staffs,
        },
      });
    }
    return res.json({
      success: false,
      message: "Lấy dữ liệu thất bại",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: errorCatch,
      errors: error.message,
    });
  }
});

// lấy nhân viên theo id
router.get("/get/:id", async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id)
      .select("-password")
      .populate("permission")
      .populate("cinema");
    return res.json({
      success: true,
      message: "Lấy dữ liệu thành công",
      staff: {
        ...staff._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server!",
      errors: error.message,
    });
  }
});

// get my

router.get("/me", verifyToken, async (req, res) => {
  try {
    const staff = await Staff.findById(req.staffId)
      .select("-password")
      .populate("permission")
      .populate("cinema");
    return res.json({
      success: true,
      message: "Lấy dữ liệu thành công",
      staff: {
        ...staff._doc,
        password: undefined,
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

// Thêm nhân viên

router.post("/register", verifyToken, async (req, res) => {
  const {
    email,
    fullName,
    phoneNumber,
    dateOfBirth,
    address,
    male,
    avatar,
    permissionId,
    cinemaId,
  } = req.body;
  try {
    if (req.type < 2) {
      const checkEmail = await Staff.findOne({ email: email });
      const checkPhone = await Staff.findOne({ phoneNumber: phoneNumber });

      const isEmail = checkEmail ? true : false;
      const isPhone = checkPhone ? true : false;
      const { valid, errors } = ValidateStaff(
        email,
        fullName,
        phoneNumber,
        male,
        isEmail,
        isPhone,
        permissionId,
        cinemaId
      );
      if (!valid) {
        res.json({
          success: false,
          message: "Thêm nhân viên thất bại",
          errors: errors,
        });
      } else {
        const hashedPassword = await bcrypt.hash("123456", 12);
        const newStaff = new Staff({
          email,
          password: hashedPassword,
          phoneNumber,
          profile: {
            fullName,
            avatar,
            dateOfBirth,
            male,
            address,
          },
          createdAt: new Date().toISOString(),
          permission: permissionId,
          cinema: cinemaId,
        });

        await newStaff.save();
        const staff = await Staff.findById(newStaff._id)
          .populate("permission")
          .populate("cinema");
        const token = generateToken(staff);

        res.json({
          success: true,
          message: "Thêm nhân viên thành công",
          values: {
            token: token,
            staff: {
              ...staff._doc,
              password: undefined,
            },
          },
        });
      }
    }
    return res.json({
      success: false,
      message: "Bạn không có quyền này",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: errorCatch,
      errors: error.message,
    });
  }
});

// Đăng nhập

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const checkEmail = await Staff.findOne({ email: username })
      .populate("permission")
      .populate("cinema");
    const checkPhone = await Staff.findOne({ phoneNumber: username })
      .populate("permission")
      .populate("cinema");
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
      const staff = checkEmail ? checkEmail : checkPhone;
      delete staff.password;
      const match = await bcrypt.compare(password, staff.password);
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
        const token = generateToken(staff);
        res.json({
          success: true,
          message: "Đăng nhập",
          values: {
            token: token,
            staff: {
              ...staff._doc,
              password: undefined,
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

// Sửa nhân viên

router.put("/update/:id", verifyToken, async (req, res) => {
  try {
    console.log(req.type);
    if (req.type < 2) {
      const oldStaff = await Staff.findById(req.params.id);
      const {
        email,
        fullName,
        phoneNumber,
        dateOfBirth,
        address,
        male,
        avatar,
        permissionId,
        cinemaId,
      } = req.body;
      let isEmail = false;
      let isPhone = false;
      if (email !== oldStaff.email) {
        const checkEmail = await Staff.findOne({ email: email });
        isEmail = checkEmail ? true : false;
      }
      if (phoneNumber !== oldStaff.phoneNumber) {
        const checkPhone = await Staff.findOne({ phoneNumber: phoneNumber });
        isPhone = checkPhone ? true : false;
      }

      if (oldStaff) {
        const { valid, errors } = ValidateStaff(
          email,
          fullName,
          phoneNumber,
          male,
          isEmail,
          isPhone,
          permissionId,
          cinemaId
        );
        if (!valid) {
          return res.json({
            success: false,
            message: "Sửa nhân viên thất bại",
            errors: errors,
          });
        } else {
          oldStaff.email = email;
          oldStaff.phoneNumber = phoneNumber;
          oldStaff.permission = permissionId;
          oldStaff.cinema = cinemaId;

          oldStaff.profile.fullName = fullName;
          oldStaff.profile.male = male;
          oldStaff.profile.dateOfBirth = dateOfBirth;
          oldStaff.profile.address = address;
          oldStaff.profile.avatar = avatar;

          await oldStaff.save();

          const staff = await Staff.findById(oldStaff._id)
            .populate("permission")
            .populate("cinema");

          return res.json({
            success: true,
            message: "Sửa nhân viên thành công",
            values: {
              staff: {
                ...staff._doc,
                password: undefined,
              },
            },
          });
        }
      }
      return res.json({
        success: false,
        message: "Sửa nhân viên thất bại",
        errors: "Không tìm thấy nhân viên này",
      });
    }
    return res.json({
      success: false,
      message: "Bạn không có quyền này",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: errorCatch,
      errors: error.message,
    });
  }
});

// Xóa nhân viên

router.delete("/delete/:id", verifyToken, async (req, res) => {
  try {
    if (req.type < 2) {
      const staff = await Staff.findOneAndDelete({ _id: req.params.id });
      if (staff) {
        res.json({
          success: true,
          message: "Xóa nhân viên thành công",
          values: {
            staff,
          },
        });
      }
      res.json({
        success: false,
        message: "Xóa nhân viên thất bại",
      });
    }
    return res.json({
      success: false,
      message: "Bạn không có quyền này",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: errorCatch,
      errors: error.message,
    });
  }
});

router.put("/change-password", verifyToken, async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const staff = await Staff.findById({ _id: req.staffId });
    if (staff) {
      const match = await bcrypt.compare(oldPassword, staff.password);
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
      staff.password = hashedPassword;
      await staff.save();
      return res.json({
        success: true,
        message: "Đổi mật khẩu thành công",
      });
    }
    res.json({
      success: false,
      message: "Không tìm thấy nhân viên này",
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
