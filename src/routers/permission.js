import express from "express";
const router = express.Router();
import Permission from "../models/Permission";

router.post("/add", async (req, res) => {
  const { name, type } = req.body;

  try {
    const permission = new Permission({
      name,
      type,
    });
    await permission.save();
    return res.json({
      success: true,
      message: "Thêm quyền thành công",
      values: {
        permission,
      },
    });
  } catch (error) {
    res.json({
      success: false,
      message: "Lỗi server 500!",
      errors: error.message,
    });
  }
});

router.get("/all", async (req, res) => {
  try {
    const permissions = await Permission.find();
    if (permissions) {
      return res.json({
        success: true,
        message: "Lấy danh sách quyền truy cập thành công",
        values: { permissions },
      });
    }
    return res.json({
      success: false,
      message: "Lấy danh sách quyền truy cập thất bại",
      error: "",
    });
  } catch (error) {
    res.json({
      success: false,
      message: "Lỗi server 500!",
      errors: error.message,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const permission = await Permission.findById(req.params.id);
    if (permission) {
      return res.json({
        success: true,
        message: "Lấy thể loại phim thành công",
        values: { permission },
      });
    }
    return res.status(400).json({
      success: false,
      message: "Lấy thể loại phim thất bại",
      error: "id tào lao",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi server!",
      error: error.message,
    });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const permission = await Permission.findOneAndDelete({
      _id: req.params.id,
    });
    if (permission) {
      return res.json({
        success: true,
        message: "Xóa thể loại phim thành công",
        values: { permission },
      });
    }
    return res.status(400).json({
      success: false,
      message: "Xóa thể loại phim thất bại",
      error: "id tào lao",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi server!",
      error: error.message,
    });
  }
});

module.exports = router;
