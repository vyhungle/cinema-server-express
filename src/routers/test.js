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
import { createSeatId } from "../utils/helper";
import { errorCatch } from "../utils/constaints";
import { createBillTicket } from "../service/ticket";

router.get("/test", async (req, res) => {
  createSeatId("C1", "61a649095ffee10037731f1a");
});

router.get("/add-data", async (req, res) => {
  try {
    const data = {
      // field tạo showtime
      movieId: "616e7e62ecac510037c54960",
      cinemaId: "614c03db576b5d00376801a6",

      showTimes: [
        {
          // field tạo showtime detail [room showTime, timeSlot, date]
          roomId: "6169a3a5038631344897c7b7",
          time: "6154593a543dc74d680458ca",
          date: "11/30/2021",
          ticket: [
            {
              data: [
                {
                  seatName: "A1",
                  price: 80000,
                  status: 0,
                  type: 1,
                },
                {
                  seatName: "A2",
                  price: 80000,
                  status: 0,
                  type: 1,
                },
              ],
              combos: [],
              gifts: [],
              coupons: [],
              payment: {
                type: "0",
              },
              userId: "613e17d875cc9e00375d5ce5",
            },
          ],
        },
      ],
    };

    const showTime = new ShowTime({
      cinema: data.cinemaId,
      movie: data.movieId,
    });

    const movie = await Movie.findById(data.movieId);

    data.showTimes.forEach(async (item) => {
      const showTimeDetail = new ShowTimeDetail({
        date: item.date,
        room: item.roomId,
        showTime: showTime._id,
        timeSlot: item.time,
      });

      const room = await Room.findById(item.roomId).populate("screen");

      item.ticket.forEach(async (ticket) => {
        await createBillTicket(
          ticket.data,
          ticket.userId,
          showTimeDetail._id,
          data.cinemaId,
          showTime._id,
          movie?.name,
          room?.name,
          room?.screen?.name,
          new Date(item.date).toISOString(),
          ticket.payment.type
        );
      });

      await showTimeDetail.save();
    });

    await showTime.save();
  } catch (error) {
    res.status(400).json({
      success: false,
      message: errorCatch,
      errors: error.message,
    });
  }
});

module.exports = router;
