import express from "express";
const router = express.Router();
import moment from "moment";

import ShowTime from "../models/ShowTime"; //fix log
import ShowTimeDetail from "../models/ShowTimeDetail";
import { ValidateShowTime } from "../utils/validators";
const getDate = (parentDate, childDate) => {
  return childDate === "" || childDate === undefined || childDate === null
    ? parentDate
    : childDate;
};
router.post("/add", async (req, res) => {
  const { dateStart, dateEnd, screenDetailId, cinemaId, showTimes } = req.body;
  try {
    const { errors, valid } = ValidateShowTime(
      dateStart,
      dateEnd,
      screenDetailId,
      cinemaId,
      showTimes
    );
    if (valid) {
      const newShowTime = await ShowTime({
        screenDetail: screenDetailId,
        cinema: cinemaId,
        status: true,
      });
      await newShowTime.save();

      // add show time detail

      showTimes.map((item) => {
        item.times.map(async (time) => {
          const date_start = new Date(getDate(dateStart, item.dateStart));
          const date_end =
            getDate(dateEnd, item.dateEnd) === "" ||
            getDate(dateEnd, item.dateEnd) === undefined ||
            getDate(dateEnd, item.dateEnd) === null
              ? new Date(date_start)
              : new Date(getDate(dateEnd, item.dateEnd));
          do {
            const checkShowTimeDetail = await ShowTimeDetail.findOne({
              room: item.roomId,
              showTime: item.showTimeId,
              timeSlot: time,
              date: moment(date_start).format("L"),
            });
            if (!checkShowTimeDetail) {
              const showTimeDetail = await ShowTimeDetail({
                date: moment(date_start).format("L"),
                room: item.roomId,
                showTime: newShowTime._id,
                timeSlot: time,
              });
              await showTimeDetail.save();
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
  const { dateStart, dateEnd } = req.body;
  try {
    const date_start = new Date(dateStart);
    const date_end =
      dateEnd === "" || dateEnd === undefined || dateEnd === null
        ? new Date(dateStart)
        : new Date(dateEnd);
    let showTimes = [];
    do {
      const showTimeList = await ShowTimeDetail.find({
        date: moment(date_start).format("L"),
      })
        .populate("room")
        .populate("timeSlot")
        .populate("showTime");
      showTimes = showTimes.concat(showTimeList);
      date_start.setDate(date_start.getDate() + 1);
    } while (date_start <= date_end);

    return res.json({
      success: true,
      message: "Lấy danh sách lịch chiếu thành công",
      showTimes,
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
