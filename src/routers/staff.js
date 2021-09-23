import express from "express";
const router = express.Router();
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { ValidateLoginInput, ValidateStaff } from "../utils/validators";
import Staff from "../models/Staff";
import verifyToken from "../middleware/staff";

function generateToken(staff) {
  return jwt.sign(
    {
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
    res.status(500).json({
      success: false,
      message: "Lỗi server!",
      errors: error.message,
    });
  }
});

// lấy nhân viên theo id
router.get("/get/:id", async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id)
      .select("-password")
      .populate("permission");
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
      .populate("permission");
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
        permissionId
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
        });

        await newStaff.save();
        const staff = await Staff.findById(newStaff._id).populate("permission");
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
    res.status(500).json({
      success: false,
      message: "Lỗi server!",
      errors: error.message,
    });
  }
});

// Đăng nhập

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const checkEmail = await Staff.findOne({ email: username }).populate(
      "permission"
    );
    const checkPhone = await Staff.findOne({ phoneNumber: username }).populate(
      "permission"
    );
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
    res.status(500).json({
      success: false,
      message: "Lỗi server!",
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
          permissionId
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
          oldStaff.permissionId = permissionId;

          oldStaff.profile.fullName = fullName;
          oldStaff.profile.male = male;
          oldStaff.profile.dateOfBirth = dateOfBirth;
          oldStaff.profile.address = address;
          oldStaff.profile.avatar = avatar;

          await oldStaff.save();

          const staff = await Staff.findById(oldStaff._id);

          return res.json({
            success: true,
            message: "Sửa nhân viên thành công",
            values: {
              staff,
            },
          });
        }
      }
      return res.status(400).json({
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
    res.status(500).json({
      success: false,
      message: "Lỗi server!",
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
      res.status(400).json({
        success: false,
        message: "Xóa nhân viên thất bại",
      });
    }
    return res.json({
      success: false,
      message: "Bạn không có quyền này",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server!",
      errors: error.message,
    });
  }
});

module.exports = router;
