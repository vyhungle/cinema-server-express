import express from "express";
const router = express.Router();
import TimeSlot from "../models/TimeSlot";
import { errorCatch } from "../utils/constaints";

router.post("/add", async (req, res) => {
  const { time } = req.body;
  try {
    const newTime = new TimeSlot({
      time,
    });
    await newTime.save();
    return res.json({
      success: true,
      message: "Thêm khung giờ thành công",
      values: {
        timeSlot: newTime,
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
    const times = await TimeSlot.find();
    return res.json({
      success: true,
      message: "Lấy danh sách khung giờ thành công",
      values: {
        timeSlots: times,
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

module.exports = router;
