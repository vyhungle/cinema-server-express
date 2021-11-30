import express from "express";
const router = express.Router();
import moment from "moment";

import ShowTime from "../models/ShowTime"; //fix log
import ShowTimeDetail from "../models/ShowTimeDetail";
import Cinema from "../models/Cinema";
import {
  mergeCinemaShowtime,
  mergeShowTime,
  renderShowTime,
  resShowTimeByDate,
} from "../utils/helper";
import { ValidateShowTime } from "../utils/validators";
import { errorCatch } from "../utils/constaints";
import validateToken from "../middleware/staff";
const getDate = (parentDate, childDate) => {
  return childDate === "" || childDate === undefined || childDate === null
    ? parentDate
    : childDate;
};
router.post("/add", validateToken, async (req, res) => {
  const { dateStart, dateEnd, movieId, cinemaId, showTimes } = req.body;
  try {
    const { errors, valid } = ValidateShowTime(
      dateStart,
      dateEnd,
      movieId,
      cinemaId,
      showTimes
    );
    if (valid) {
      const newShowTime = await ShowTime({
        movie: movieId,
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
    return res.status(400).json({
      success: false,
      message: "Thêm lịch chiếu thất bại",
      errors,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: errorCatch,
      errors: error.message,
    });
  }
});

router.post("/get-list-showtime", async (req, res) => {
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
        .populate({
          path: "room",
          populate: {
            path: "screen",
          },
        })
        .populate("timeSlot")
        .populate({
          path: "showTime",
          populate: {
            path: "movie",
          },
        });

      showTimes = showTimes.concat(showTimeList);
      date_start.setDate(date_start.getDate() + 1);
    } while (date_start <= date_end);

    return res.json({
      success: true,
      message: "Lấy danh sách lịch chiếu thành công",
      showTimes: mergeShowTime(showTimes),
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: errorCatch,
      errors: error.message,
    });
  }
});

router.get("/get-list-showtime-by-date", async (req, res) => {
  const { movieId, cinemaId, date, screenId } = req.query;
  try {
    const showTimeList = await ShowTimeDetail.find({
      date: moment(new Date(date)).format("L"),
    })
      .populate({
        path: "room",
        populate: {
          path: "screen",
        },
      })
      .populate("timeSlot")
      .populate({
        path: "showTime",
        populate: {
          path: "movie",
        },
      });

    const showTimeFilter = renderShowTime(
      showTimeList,
      movieId,
      cinemaId,
      screenId
    );
    return res.json({
      success: true,
      message: "Lấy danh sách lịch chiếu thành công",
      showTimes: resShowTimeByDate(showTimeFilter),
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: errorCatch,
      errors: error.message,
    });
  }
});

router.get("/get-list-showtime-full", async (req, res) => {
  const { movieId, date, screenId, location } = req.query;
  try {
    const showTimeList = await ShowTimeDetail.find({
      date: moment(new Date(date)).format("L"),
    })
      .populate({
        path: "room",
        populate: {
          path: "screen",
        },
        populate: {
          path: "cinema",
        },
      })
      .populate("timeSlot")
      .populate({
        path: "showTime",
        populate: {
          path: "movie",
        },
      });
    const showTimeFilter = renderShowTime(
      showTimeList,
      movieId,
      undefined,
      screenId,
      location
    );

    return res.json({
      success: true,
      message: "Lấy danh sách lịch chiếu thành công",
      showTimes: mergeCinemaShowtime(showTimeFilter),
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
