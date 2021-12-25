import express from "express";
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
import { renderBillId } from "../utils/format";

export const createBillTicket = async (
  data,
  userId,
  showTimeDetailId,
  cinemaId,
  showTimeId,
  movieName,
  roomName,
  screenName,
  createdAt,
  paymentType,
  staffId
) => {
  //#region  Tạo hóa đơn vé và vé
  if (data && data.length > 0) {
    const lastBill = await MovieBill.find().sort({ _id: -1 }).limit(1);
    const oldId = lastBill[0]?.billId || `HDT_00000`;
    const bill = new MovieBill({
      billId: renderBillId(oldId),
      user: userId,
      showTime: showTimeId,
      showTimeDetail: showTimeDetailId,
      cinema: cinemaId,
      movieName: movieName,
      roomName: roomName,
      screenName: screenName,
      total: 0,
      createdAt: createdAt,
      paymentType: paymentType,
      staff: staffId,
    });

    // tạo vé
    let totalPrice = 0;
    data.forEach(async (item) => {
      let newTicker = {};
      newTicker = new Ticker({
        idSeat: createSeatId(item.seatName, showTimeDetailId),
        seatName: item.seatName,
        price: item.price,
        status: item.status,
        showTimeDetail: showTimeDetailId,
        type: item.type,
      });
      await newTicker.save();

      // Tạo chi tiết hóa đơn
      const billDetail = new MovieBillDetail({
        movieBill: bill._id,
        ticket: newTicker._id,
        price: item.price,
      });
      await billDetail.save();
      totalPrice += item.price;
    });
    // tính lại total bill
    bill.total = totalPrice;
    await bill.save();
  }
  //#endregion
};
