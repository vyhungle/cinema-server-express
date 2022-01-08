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
import { getDateEnd } from "../utils/service";

router.get("/test", async (req, res) => {
  createSeatId("C1", "61a649095ffee10037731f1a");
});

router.get("/add-data", async (req, res) => {
  try {
    const data = {
      month: 11,
      year: 2021,
      // field tạo showtime
      movieId: "616e7e62ecac510037c54960",
      cinemaId: "614c03db576b5d00376801a6",
      staffId: "61d93b2b16fc3b1db89e178e",

      showTimes: [
        {
          // field tạo showtime detail [room showTime, timeSlot, date]
          roomId: "6169a3b2038631344897c7bc",
          time: "61545946543dc74d680458cc",
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
                // {
                //   seatName: "A3",
                //   price: 80000,
                //   status: 0,
                //   type: 1,
                // },
              ],
              combos: [
                { _id: "617cf540fb0f0b175c1d80c8", quantity: 1 }
              ],
              gifts: [
                { _id: "61829527a96d972d441fb349", quantity: 1, coupon: false },
                // // { _id: "61829527a96d972d441fb349", quantity: 1, coupon: true },
                { _id: "618293aab3b05642dc7bf89f", quantity: 1, coupon: false },
                // { _id: "618293aab3b05642dc7bf89f", quantity: 1, coupon: true },
              ],
              coupons: [],
              payment: {
                type: "0",
              },
             userId:"618b427057aee3003765620d"
            },
            {
              data: [
                {
                  seatName: "A4",
                  price: 80000,
                  status: 0,
                  type: 1,
                },
                // {
                //   seatName: "A5",
                //   price: 80000,
                //   status: 0,
                //   type: 1,
                // },
                // {
                //   seatName: "A6",
                //   price: 80000,
                //   status: 0,
                //   type: 1,
                // },
              ],
              combos: [
                { _id: "617cf540fb0f0b175c1d80c8", quantity: 1 }
              ],
              gifts: [
                // { _id: "61829527a96d972d441fb349", quantity: 1, coupon: false },
                // { _id: "61829527a96d972d441fb349", quantity: 1, coupon: true },
                { _id: "618293aab3b05642dc7bf89f", quantity: 1, coupon: false },
                // { _id: "618293aab3b05642dc7bf89f", quantity: 1, coupon: true },
              ],
              coupons: [],
              payment: {
                type: "0",
              },
             userId:"61c07789b801230037c0bb59"
            },
          ],
        },
      ],
    };


    const dateEnd = getDateEnd(data.month, data.year).getDate();
    let date = 1;
    while (dateEnd >= date) {
      const createdAt = new Date(
        `${data.month}/${date}/${data.year}`
      ).toISOString();

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
            createdAt,
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
            createdAt,
            ticket.payment.type,
            data.staffId,
            ticket.gifts
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
