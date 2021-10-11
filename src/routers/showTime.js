import express from "express";
const router = express.Router();
import moment from "moment";

import ShowTime from "../models/ShowTime"; //fix log
import request from "supertest";
import { addTicker } from "../api/serverAPI";
import ShowTimeDetail from "../models/ShowTimeDetail";
import { ValidateShowTime } from "../utils/validators";

router.post("/add", async (req, res) => {
  const { dateStart, dateEnd, screenDetailId, cinemaId, body } = req.body;
  try {
    const { errors, valid } = ValidateShowTime(
      dateStart,
      dateEnd,
      screenDetailId,
      cinemaId,
      body
    );
    if (valid) {
      const showTime = await ShowTime({
        screenDetail: screenDetailId,
        cinema: cinemaId,
        status: true,
      });
      await showTime.save();

      // add show time detail

      body.map((item) => {
        item.times.map(async (time) => {
          const date_start = new Date(dateStart);
          const date_end =
            dateEnd === "" || dateEnd === undefined || dateEnd === null
              ? new Date(dateStart)
              : new Date(dateEnd);
          do {
            const checkShowTimeDetail = await ShowTimeDetail.findOne({
              room: item.roomId,
              showTime: item.showTimeId,
              timeSlot: time,
              date: moment(date_start).format("L"),
            });
            if (!checkShowTimeDetail) {
              const showTime = await ShowTimeDetail({
                date: moment(date_start).format("L"),
                room: item.roomId,
                showTime: item.showTimeId,
                timeSlot: time,
              });
              await showTime.save();
            }
            date_start.setDate(date_start.getDate() + 1);
          } while (date_start <= date_end);
        });
      });

      return res.json({
        success: true,
        message: "Thêm lịch chiếu thành công",
      });
    }
    return res.json({
      success: false,
      message: "Thêm lịch chiếu thất bại",
      errors,
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
    message: "Lấy danh sách lịch chiếu thành công",
    showTimes,
  });
});

module.exports = router;
