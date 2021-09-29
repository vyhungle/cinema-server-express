import express from "express";
const router = express.Router();
import ShowTime from "../models/ShowTime";

router.post("/add", async (req, res) => {
  const { roomId, premiereId, timeSlotId, date } = req.body;

  try {
    const showtime = new ShowTime({
      room: roomId,
      premiere: premiereId,
      timeSlot: timeSlotId,
      date,
    });
    await showtime.save();
    return res.json({
      success: true,
      message: "Thêm lịch chiếu thành công",
      values: {
        showtime,
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
