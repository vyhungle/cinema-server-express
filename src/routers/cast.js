import express from "express";
const router = express.Router();

import Cast from "../models/Cast";
import { errorCatch } from "../utils/constaints";

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
      message: "Thêm diễn viên thành công",
      values: {
        cast,
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
    return res.json({
      success: false,
      message: "Lấy danh sách đạo diễn thất bại",
      values: { casts: [] },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: errorCatch,
      errors: error.message,
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
    return res.json({
      success: false,
      message: "Lấy diễn viên thất bại",
      values: { cast: {} },
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
