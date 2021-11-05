import express from "express";
const router = express.Router();
import Ticker from "../models/Ticker";
import ShowTimeDetail from "../models/ShowTimeDetail";
import MovieBill from "../models/MovieBill";
import MovieBillDetail from "../models/MovieBillDetail";
import Food from "../models/Food";
import FoodBill from "../models/FoodBill";
import FoodDetail from "../models/FoodDetail";
import User from "../models/User";
import Gift from "../models/Gift";
import Coupon from "../models/Coupon";
import verifyToken from "../middleware/custom";

import {
  checkWeekend,
  renderObjTicket,
  renderStringSeat,
} from "../utils/helper";
import { isPayment, renderBill } from "../utils/service";
import { errorCatch, POINT_BONUS, USER_DEFAULT } from "../utils/constaints";

router.post("/add", verifyToken, async (req, res) => {
  const {
    data,
    showTimeDetailId,
    userId = USER_DEFAULT,
    payment,
    combos,
    gifts,
    coupons,
  } = req.body;
  const { typeUser, id, type } = req;
  try {
    //#region validate user
    const _userId = typeUser === 0 ? id : userId;
    const user = await User.findById(_userId);
    if (!user) {
      res.status(400).json({
        success: false,
        message: "Không tiềm thấy người dùng này trong hệ thống.",
      });
    }

    //#endregion

    //#region data default
    let totalTicket = 0;
    let totalFood = 0;
    let idTicketBill = "";
    let idFoodBill = "";
    let numberTicket = 0;
    let giftPoint = 0;
    let giftList = [];
    let priceTicket = 0;
    let discount = 0;
    let countGiftDiscount = 0;

    const stDetail = await ShowTimeDetail.findById(showTimeDetailId)
      .populate({
        path: "room",
        populate: { path: "screen" },
      })
      .populate("timeSlot");
    const oldTickets = await Ticker.find({ showTimeDetail: showTimeDetailId });

    // tính total bill
    if (data && data.length > 0) {
      data.forEach((item) => {
        totalTicket += item.price || priceBefore;
        priceTicket = item.price || priceBefore;
      });
    }
    totalTicket -= numberTicket * priceTicket;
    if (combos && combos.length > 0) {
      for (let i = 0; i < combos.length; i++) {
        const food = await Food.findById(combos[i]._id);
        totalFood += food.price * combos[i].quantity;
      }
    }
    //#endregion

    //#region kiểm tra vé trùng
    if (data && data.length > 0) {
      let duplicateSeat = [];
      for (let i = 0; i < data.length; i++) {
        const isTicker = await Ticker.findOne({
          seatName: data[i].seatName,
          showTimeDetail: showTimeDetailId,
          idSeat: data[i].idSeat,
        });
        if (isTicker) {
          duplicateSeat.push(data[i].seatName);
        }
      }
      if (duplicateSeat.length !== 0) {
        return res.json({
          success: false,
          message: `Đã có người đặt vé cho ghế ${renderStringSeat(
            duplicateSeat
          )} Vui lòng chọn ghế khác.`,
          tickets: renderObjTicket(oldTickets, stDetail.room, stDetail._id),
        });
      }
    }
    //#endregion

    //#region kiểm tra gift point và số lượng phiếu giảm giá
    for (let i = 0; i < gifts.length; i++) {
      const gift = await Gift.findById(gifts[i]._id);
      if (gift) {
        // type = 0 loại vé
        if (gift.type === 0) {
          numberTicket = gifts[i].quantity;
        }
        // type = 1, bắp nước thì push vào mảng
        else if (gift.type === 1) {
          giftList.push({
            ...gift._doc,
            quantity: gifts[i].quantity,
          });
        }
        // type = 2 phiếu giảm giá
        else if (gift.type === 2) {
          discount = gift.discount;
          countGiftDiscount += 1;
        }

        giftPoint += gifts[0].coupon ? 0 : gift.point * gifts[0].quantity;
      }
    }
    if (user.point < giftPoint) {
      return res.json({
        success: false,
        message: "Bạn không có đủ điểm để đổi quà.",
        tickets: renderObjTicket(oldTickets, stDetail.room, stDetail._id),
      });
    }
    if (countGiftDiscount > 1) {
      return res.json({
        success: false,
        message:
          "Bạn không được phép dùng nhiều hơn 1 phiếu giảm giá cho đơn hàng này.",
        tickets: renderObjTicket(oldTickets, stDetail.room, stDetail._id),
      });
    }
    //#endregion

    //#region thanh toán online
    if (payment.type > 0) {
      const isP = await isPayment(
        payment.username,
        payment.password,
        totalFood + totalTicket
      );
      if (!isP.success) {
        return res.json(isP);
      }
    }
    //#endregion

    //#region  Tạo hóa đơn vé và vé
    if (data && data.length > 0) {
      const bill = new MovieBill({
        user: _userId,
        total: 0,
        createdAt: new Date().toISOString(),
        paymentType: payment.type,
      });

      // tạo vé
      let total = 0;
      data.forEach(async (item) => {
        const priceBefore = checkWeekend(stDetail.date)
          ? stDetail.room.screen.weekendPrice
          : stDetail.room.screen.weekdayPrice;
        const newTicker = new Ticker({
          idSeat: item.idSeat,
          seatName: item.seatName,
          price: numberTicket > 0 ? 0 : item.price || priceBefore,
          status: 1,
          showTimeDetail: showTimeDetailId,
        });

        // tính lại total
        total += numberTicket > 0 ? 0 : parseInt(newTicker.price);
        // trừ vé free
        numberTicket -= 1;
        await newTicker.save();
        // Tạo chi tiết hóa đơn
        const billDetail = new MovieBillDetail({
          movieBill: bill._id,
          ticket: newTicker._id,
        });
        await billDetail.save();
      });
      // tính lại total bill
      bill.total = total - total * discount;
      idTicketBill = bill._id;
      await bill.save();
    }
    //#endregion

    //#region  Tạo hóa đơn combo và combo detail
    if ((combos && combos.length > 0) || (gifts && giftList.length > 0)) {
      const foodBill = new FoodBill({
        user: _userId,
        total: 0,
        createdAt: new Date().toISOString(),
        paymentType: payment.type,
      });

      // tạo combo detail
      let totalFoodBill = 0;
      if (combos && combos.length > 0) {
        for (let i = 0; i < combos.length; i++) {
          const food = await Food.findById(combos[i]._id);
          const foodDetail = new FoodDetail({
            food: combos[i]._id,
            foodBill: foodBill._id,
            quantity: combos[i].quantity,
            price: food.price,
          });
          totalFoodBill += food.price * combos[i].quantity;
          await foodDetail.save();
        }
      }

      if (gifts && giftList.length > 0) {
        for (let i = 0; i < giftList.length; i++) {
          const _gift = await Gift.findById(giftList[i]._id);
          const foodGift = await Food.findById(_gift.foodId);
          const foodDetailGift = new FoodDetail({
            food: foodGift._id,
            foodBill: foodBill._id,
            quantity: giftList[i].quantity,
            price: 0,
          });
          await foodDetailGift.save();
        }
      }
      foodBill.total = totalFoodBill - totalFoodBill * discount;
      idFoodBill = foodBill._id;
      await foodBill.save();
    }

    //#endregion

    //#region Disable coupon
    if (coupons && coupons.length > 0) {
      for (let i = 0; i < coupons.length; i++) {
        const coupon = await Coupon.findOne({ code: coupons[i] });
        if (coupon) {
          coupon.status = 1;
          await coupon.save();
        }
      }
    }
    //#endregion

    //#region update điểm thưởng
    if (_userId != USER_DEFAULT) {
      const userPoint = await User.findById(_userId);
      const point =
        (userPoint.moneyPoint + totalFood + totalTicket) / POINT_BONUS;
      console.log(point);
      if (point > 1) {
        userPoint.point = userPoint.point + Math.floor(point);
        userPoint.moneyPoint = (point - Math.floor(point)) * POINT_BONUS;
      } else {
        userPoint.moneyPoint = userPoint.moneyPoint + totalFood + totalTicket;
      }
      await userPoint.save();
    }
    //#endregion
    stDetail.countTicket += data ? data.length : 0;
    stDetail.totalPriceTicket += totalFood + totalTicket;
    await stDetail.save();
    //#region render data showtime and response
    const tickets = await Ticker.find({ showTimeDetail: showTimeDetailId });
    return res.json({
      success: true,
      message: "Đặt vé thành công",
      tickets: renderObjTicket(tickets, stDetail.room, stDetail._id),
      bills: await renderBill(
        idTicketBill === "" ? undefined : idTicketBill,
        idFoodBill === "" ? undefined : idFoodBill
      ),
    });
    //#endregion
  } catch (error) {
    res.status(400).json({
      success: false,
      message: errorCatch,
      errors: error.message,
    });
  }
});

router.get("/get-list-ticker/:id", async (req, res) => {
  try {
    const tickets = await Ticker.find({ showTimeDetail: req.params.id });
    const stDetail = await ShowTimeDetail.findById(req.params.id)
      .populate({
        path: "room",
        populate: {
          path: "cinema",
        },
      })
      .populate({
        path: "room",
        populate: {
          path: "screen",
        },
      })
      .populate({
        path: "showTime",
        populate: { path: "movie" },
      })
      .populate("timeSlot");
    const combos = await Food.find();
    return res.json({
      success: true,
      message: "lấy danh sách vé thành công",
      values: {
        tickets: renderObjTicket(tickets, stDetail.room, stDetail._id),
        showTimeDetail: stDetail,
        combos,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: errorCatch,
      errors: error.message,
    });
  }
});

router.get("/get/:id", async (req, res) => {
  try {
    const tickets = await Ticker.find({ showTime: req.params.id });

    return res.json({
      success: true,
      message: "Lấy danh sách vé thành công",
      tickets,
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
