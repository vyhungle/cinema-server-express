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
import { renderBillId, renderBillNumberId } from "../utils/format";

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
  staffId,
  gifts
) => {
  //#region  Tạo hóa đơn vé và vé
  const lastBill = await MovieBill.find().sort({ _id: -1 }).limit(1);
  const oldId = lastBill[0]?.billId || `HDT_00000`;
  let numberLast = parseInt(oldId.split("_")[1], 10) + 1;
  if (data && data.length > 0) {
    const bill = new MovieBill({
      billId: renderBillNumberId("HDT", numberLast),
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
    numberLast++;

    // sort lại vé
    data = data.sort((a, b) => {
      return b.price - a.price;
    });

    // lấy số lượng vé km
    let countGift = 0;
    let countCoupon = 0;
    if (gifts && gifts.length > 0) {
      for (let i = 0; i < gifts.length; i++) {
        const gift = await Gift.findById(gifts[i]._id);
        if (gift && gift.type === 0 && !gifts[i].coupon) {
          countGift += gifts[i].quantity;
        } else if (gift && gift.type === 0 && gifts[i].coupon) {
          countCoupon += gifts[i].quantity;
        }
      }
    }
    // tạo vé từ data order
    let totalPrice = 0;
    let totalPromotion = 0;
    if (data && data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        let newTicker = new Ticker({
          idSeat: createSeatId(data[i].seatName, showTimeDetailId),
          seatName: data[i].seatName,
          price: data[i].price,
          status: data[i].status,
          showTimeDetail: showTimeDetailId,
          type: data[i].type,
        });
        await newTicker.save();

        // Tạo chi tiết hóa đơn
        const priceSell = getPrice(countGift, countCoupon, data[i].price);
        const price = data[i].price;
        const promotion = data[i].price - priceSell;
        const promotionType = getTypeKM(countGift, countCoupon, data[i].price);
        const billDetail = new MovieBillDetail({
          movieBill: bill._id,
          ticket: newTicker._id,
          price,
          priceSell,
          promotion,
          promotionType,
        });
        await billDetail.save();
        totalPrice += priceSell;
        totalPromotion += promotion;
        if (countGift > 0) {
          countGift--;
        } else if (countCoupon > 0) {
          countCoupon--;
        }
      }
    }
    // tính lại total bill
    bill.total = totalPrice;
    bill.promotion = totalPromotion;
    await bill.save();
  }
  //#endregion
};

const getPrice = (isGift, isCoupon, price) => {
  if (isGift > 0 || isCoupon > 0) {
    return 0;
  }
  return price;
};

export const getTypeKM = (isGift, isCoupon) => {
  if (isGift > 0) {
    return "Đổi điểm";
  } else if (isCoupon > 0) {
    return "Dùng phiếm mua hàng";
  }
  return "Không dùng khuyến mãi";
};

export const createFoodBill = async (
  combos,
  userId,
  showTimeDetailId,
  cinemaId,
  showTimeId,
  movieName,
  roomName,
  screenName,
  createdAt,
  paymentType,
  staffId,
  gifts
) => {
  const lastBill = await FoodBill.find().sort({ _id: -1 }).limit(1);
  const oldId = lastBill[0]?.billId || `HDF_00000`;
  let numberLast = parseInt(oldId.split("_")[1], 10) + 1;
  if ((combos && combos.length > 0) || (gifts && gifts.length > 0)) {
    const foodBill = new FoodBill({
      billId: renderBillNumberId("HTF", numberLast),
      user: userId,
      showTime: showTimeId,
      showTimeDetail: showTimeDetailId,
      cinema: cinemaId,
      movieName: movieName,
      roomName: roomName,
      screenName: screenName,
      total: 0,
      createdAt,
      paymentType: paymentType,
      staff: staffId,
    });

    // tạo combo detail
    let total = 0;
    if (combos && combos.length > 0) {
      for (let i = 0; i < combos.length; i++) {
        const food = await Food.findById(combos[i]._id);
        const foodDetail = new FoodDetail({
          food: combos[i]._id,
          foodBill: foodBill._id,
          quantity: combos[i].quantity,
          price: food.price,
          priceSell: food.price * combos[i].quantity,
        });
        total += food.price * combos[i].quantity;
        await foodDetail.save();
      }
    }

    let totalPromotion = 0;
    if (gifts && gifts.length > 0) {
      for (let i = 0; i < gifts.length; i++) {
        const _gift = await Gift.findById(gifts[i]._id);
        if (_gift.type == 1) {
          const foodGift = await Food.findById(_gift.foodId);
          const foodDetailGift = new FoodDetail({
            food: foodGift._id,
            foodBill: foodBill._id,
            quantity: gifts[i].quantity,
            price: foodGift.price,
            priceSell: 0,
            promotion: gifts[i].quantity * foodGift.price,
            promotionType: gifts[i].coupon ? "Dùng phiếm mua hàng" : "Đổi điểm",
          });
          await foodDetailGift.save();
          totalPromotion += gifts[i].quantity * foodGift.price;
        }
      }
    }
    foodBill.total = total;
    foodBill.promotion = totalPromotion;
    await foodBill.save();
  }
};
