import express from "express";
const router = express.Router();
import Payment from "../models/Payment";
import MovieBillDetail from "../models/MovieBillDetail";
import FoodDetail from "../models/FoodDetail";
import FoodBill from "../models/FoodBill";
import MovieBill from "../models/MovieBill";
import Coupon from "../models/Coupon";
import Gift from "../models/Gift";
import GiftDetail from "../models/GiftDetail";
import User from "../models/User";
import Cinema from "../models/Cinema";
import Movie from "../models/Movie";
import ShowTime from "../models/ShowTime";
import ShowTimeDetail from "../models/ShowTimeDetail";
import Ticker from "../models/Ticker";
import Food from "../models/Food";
import Room from "../models/Room";
import TimeSlot from "../models/TimeSlot";
import { createSeatId, getRandomInt } from "../utils/helper";
import { errorCatch } from "../utils/constaints";
import { createBillTicket, createFoodBill } from "../service/ticket";
import { getDateEnd } from "../utils/service";
import {
  cinemaData,
  comboData,
  giftData,
  movieData,
  tickerData,
  timeData,
  userData,
} from "../utils/data";

router.get("/test", async (req, res) => {
  createSeatId("C1", "61a649095ffee10037731f1a");
});

router.get("/add-data", async (req, res) => {
  try {
    const data = {
      month: 1,
      year: 2022,
      // field tạo showtime
      cinemaId: 1,
      numberShowTime: 1,
      numberBill: 1,
    };

    const cinema = cinemaData[data.cinemaId];

    const dateEnd = getDateEnd(data.month, data.year).getDate();
    let date = 1;

    while (dateEnd >= 17) {
      const createdAt = new Date(
        `${data.month}/${date}/${data.year}`
      ).toISOString();

      for (let i = 0; i < data.numberShowTime; i++) {
        const movieId = movieData[getRandomInt(3)];
        const showTime = new ShowTime({
          cinema: cinema.cinema.id,
          movie: movieId,
        });
        const movie = await Movie.findById(movieId);

        for (let j = 0; j < data.numberBill; j++) {
          const tickerRandom = tickerData[getRandomInt(4)];
          const roomId = cinema.room[getRandomInt(3)];
          const room = await Room.findById(roomId).populate("screen");
          const showTimeDetail = new ShowTimeDetail({
            date: `${data.month}/${date}/${data.year}`,
            room: roomId,
            showTime: showTime._id,
            timeSlot: timeData[getRandomInt(4)],
          });
          await createBillTicket(
            tickerRandom.data,
            userData[getRandomInt(6)],
            showTimeDetail._id,
            cinema.cinema.id,
            showTime._id,
            movie?.name,
            room?.name,
            room?.screen?.name,
            createdAt,
            0,
            cinema.staff[getRandomInt(2)],
            giftData[getRandomInt(4)].data
          );
          await createFoodBill(
            comboData[getRandomInt(4)].data,
            userData[getRandomInt(6)],
            showTimeDetail._id,
            cinema.cinema.id,
            showTime._id,
            movie?.name,
            room?.name,
            room?.screen?.name,
            createdAt,
            0,
            cinema.staff[getRandomInt(2)],
            giftData[getRandomInt(4)].data
          );
          await showTimeDetail.save();
        }
        await showTime.save();
      }
      date++;
    }

    return res.json({
      message: "Thêm thành công",
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
