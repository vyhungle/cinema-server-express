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
      month: 4,
      year: 2022,
      // field tạo showtime
      movieId: movieData[getRandomInt(5)],
      cinemaId: 0,

      showTimes: [
        {
          // field tạo showtime detail [room showTime, timeSlot, date]

          ticket: [
            {
              payment: {
                type: "0",
              },
            },
            {
              payment: {
                type: "0",
              },
            },
          ],
        },
      ],
    };

    const cinema = cinemaData[data.cinemaId];

    const dateEnd = getDateEnd(data.month, data.year).getDate();
    let date = 1;
    const movieId = movieData[getRandomInt(5)];

    while (dateEnd >= date) {
      const createdAt = new Date(
        `${data.month}/${date}/${data.year}`
      ).toISOString();

      const showTime = new ShowTime({
        cinema: cinema.cinema.id,
        movie: movieId,
      });

      const movie = await Movie.findById(movieId);

      data.showTimes.forEach(async (item) => {
        const tickerRandom = tickerData[getRandomInt(4)];
        const showTimeDetail = new ShowTimeDetail({
          date: `${data.month}/${date}/${data.year}`,
          room: cinema.room[getRandomInt(3)],
          showTime: showTime._id,
          timeSlot: timeData[getRandomInt(4)],
        });

        const room = await Room.findById(item.roomId).populate("screen");

        item.ticket.forEach(async (ticket) => {
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
            giftData[getRandomInt(4)]
          );
          await createFoodBill(
            comboData[getRandomInt(4)],
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
            giftData[getRandomInt(4)]
          );
        });

        await showTimeDetail.save();
      });

      await showTime.save();
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
