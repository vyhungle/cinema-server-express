import express from "express";
const router = express.Router();
import TimeSlot from "../models/TimeSlot";

router.post("/add", async (req, res) => {
  const { name, time } = req.body;
  try {
    const newTime = new TimeSlot({
      name,
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
      message: "Lỗi 400!",
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
      message: "Lỗi 400!",
      errors: error.message,
    });
  }
});

module.exports = router;
