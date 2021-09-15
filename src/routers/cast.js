import express from "express";
const router = express.Router();

import Cast from "../models/Cast";

// Create cast
router.post("/add", async (req, res) => {
  const {
    name,
    dateOfBirth,
    image,
    joinDate,
    address,
    phoneNumber,
    email,
    introduce,
    male,
  } = req.body;

  try {
    const cast = new Cast({
      name,
      dateOfBirth,
      image,
      joinDate,
      address,
      phoneNumber,
      email,
      introduce,
      male,
    });
    await cast.save();
    return res.json({
      success: true,
      message: "Thêm đạo diển thành công",
      values: {
        cast,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi server!",
      error: error.message,
    });
  }
});

router.get("/all", async (req, res) => {
  try {
    const casts = await Cast.find();
    if (casts) {
      return res.json({
        success: true,
        message: "Lấy danh sách đạo diễn thành công",
        values: { casts },
      });
    }
    return res.status(400).json({
      success: false,
      message: "Lấy danh sách đạo diển thất bại",
      values: { casts: [] },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi server!",
      error: error.message,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const cast = await Cast.findById(req.params.id);
    if (cast) {
      return res.json({
        success: true,
        message: "Lấy đạo diễn thành công",
        values: { cast },
      });
    }
    return res.status(400).json({
      success: false,
      message: "Lấy đạo diển thất bại",
      values: { cast: {} },
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
