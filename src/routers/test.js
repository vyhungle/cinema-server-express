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
import { createBillTicket, createFoodBill } from "../service/ticket";

router.get("/test", async (req, res) => {
  createSeatId("C1", "61a649095ffee10037731f1a");
});

router.get("/add-data", async (req, res) => {
  try {
    const data = {
      // field tạo showtime
      movieId: "6169a42f038631344897c7c6",
      cinemaId: "614c8a9e192439003768b5c1",
      staffId: "61c9b0eff18ff040e88fb145",

      showTimes: [
        {
          // field tạo showtime detail [room showTime, timeSlot, date]
          roomId: "61a635c42e81e9003766942f",
          time: "6154593a543dc74d680458ca",
          date: "10/5/2021",
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
                {
                  seatName: "A3",
                  price: 80000,
                  status: 0,
                  type: 1,
                },
              ],
              combos: [{ _id: "617cf540fb0f0b175c1d80c8", quantity: 1 }],
              gifts: [
                { _id: "61829527a96d972d441fb349", quantity: 1, coupon: false },
                // { _id: "61829527a96d972d441fb349", quantity: 1, coupon: true },
                // { _id: "618293aab3b05642dc7bf89f", quantity: 1, coupon: false },
                { _id: "618293aab3b05642dc7bf89f", quantity: 1, coupon: true },
              ],
              coupons: [],
              payment: {
                type: "0",
              },
              userId: "613e17d875cc9e00375d5ce5",
            },
            {
              data: [
                {
                  seatName: "A4",
                  price: 80000,
                  status: 0,
                  type: 1,
                },
                {
                  seatName: "A5",
                  price: 80000,
                  status: 0,
                  type: 1,
                },
                {
                  seatName: "A6",
                  price: 80000,
                  status: 0,
                  type: 1,
                },
              ],
              combos: [{ _id: "617cf540fb0f0b175c1d80c8", quantity: 1 }],
              gifts: [
                { _id: "61829527a96d972d441fb349", quantity: 1, coupon: false },
                { _id: "61829527a96d972d441fb349", quantity: 1, coupon: true },
                { _id: "618293aab3b05642dc7bf89f", quantity: 1, coupon: false },
                { _id: "618293aab3b05642dc7bf89f", quantity: 1, coupon: true },
              ],
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
          ticket.payment.type,
          data.staffId,
          ticket.gifts
        );
        await createFoodBill(
          ticket.combos,
          ticket.userId,
          showTimeDetail._id,
          data.cinemaId,
          showTime._id,
          movie?.name,
          room?.name,
          room?.screen?.name,
          new Date(item.date).toISOString(),
          ticket.payment.type,
          data.staffId,
          ticket.gifts
        );
      });

      await showTimeDetail.save();
    });

    await showTime.save();

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
