import express from "express";
const router = express.Router();
import ShowTime from "../models/ShowTime";
import request from "supertest";
import { addTicker } from "../api/serverAPI";

router.post("/add", async (req, res) => {
  const client = request(req.app);
  const { roomId, premiereId, timeSlotsId, date } = req.body;

  try {
    timeSlotsId.map(async (item) => {
      const checkShowTime = await ShowTime.findOne({
        date: date,
        timeSlot: item,
      });
      if (!checkShowTime) {
        const showtime = new ShowTime({
          room: roomId,
          premiere: premiereId,
          timeSlot: item,
          date,
        });

        await showtime.save();
        const findShowTime = await ShowTime.findById(showtime._id)
          .populate("room")
          .populate({
            path: "premiere",
            populate: { path: "screen" },
          });
        const day = new Date(date);
        const is_weekend = day.getDay() === 6 || day.getDay() === 0;

        // thêm vé
        addTicker(client, "/api/ticker/add", {
          rowNumber: findShowTime.room.rowNumber,
          seatInRow: findShowTime.room.seatsInRow,
          price: is_weekend
            ? findShowTime.premiere.screen.weekendPrice
            : findShowTime.premiere.screen.weekdayPrice,
          showTime: findShowTime._id,
        });
      }
    });
    return res.json({
      success: true,
      message: "Thêm lịch chiếu thành công",
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
  const showTimes = await ShowTime.find()
    .populate("room")
    .populate("timeSlot")
    .populate({
      path: "premiere",
      populate: { path: "movie" },
    })
    .populate({
      path: "premiere",
      populate: { path: "screen" },
    });
  return res.json({
    success: true,
    message: "Lấy danh dách lịch chiếu thành công",
    showTimes,
  });
});

module.exports = router;
