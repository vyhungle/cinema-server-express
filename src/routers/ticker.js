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

import {
  checkWeekend,
  renderObjTicket,
  renderStringSeat,
} from "../utils/helper";
import { isPayment, renderBill } from "../utils/service";
import { POINT_BONUS, USER_DEFAULT } from "../utils/constaints";

router.post("/add", async (req, res) => {
  const {
    data,
    showTimeDetailId,
    userId = USER_DEFAULT,
    payment,
    combos,
  } = req.body;
  // seatNames, showTimeDetailId, price, idSeat, status
  try {
    //#region validate user
    if (userId != "client") {
      const user = await User.findById(userId);
      if (!user) {
        res.status(400).json({
          success: false,
          message: "Không tiềm thấy người dùng này trong hệ thống.",
        });
      }
    }
    //#endregion

    //#region lấy data default
    const stDetail = await ShowTimeDetail.findById(showTimeDetailId).populate({
      path: "room",
      populate: { path: "screen" },
    });
    const combosFood = await Food.find();
    const oldTickets = await Ticker.find({ showTimeDetail: showTimeDetailId });
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
          showTimeDetail: stDetail,
          combos: combosFood,
        });
      }
    }
    //#endregion

    //#region thanh toán online
    if (payment.type > 0) {
      let totalTicket = 0;
      let totalFood = 0;
      if (data && data.length > 0) {
        data.forEach((item) => {
          totalTicket += item.price || priceBefore;
        });
      }
      if (combos && combos.length > 0) {
        for (let i = 0; i < combos.length; i++) {
          const food = await Food.findById(combos[i]._id);
          totalFood += food.price * combos[i].quantity;
        }
      }
      const isP = await isPayment(
        payment.username,
        payment.password,
        totalFood + totalTicket
      );
      if (!isP.success) {
        return res.json(isP);
      }

      // update điểm thưởng
      if (userId != USER_DEFAULT) {
        const userPoint = await User.findById(userId);
        const point = Math.floor(
          (userPoint.moneyPoint + totalFood + totalTicket) / POINT_BONUS
        );
        if (point > 1) {
          userPoint.moneyPoint = 0;
          userPoint.point = userPoint.point + point;
        } else {
          userPoint.moneyPoint = userPoint.moneyPoint + totalFood + totalTicket;
        }
        await userPoint.save();
      }
    }
    //#endregion

    //#region  Tạo hóa đơn vé và vé
    let idTicketBill = "";
    if (data && data.length > 0) {
      const bill = new MovieBill({
        user: userId,
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
          price: item.price || priceBefore,
          status: 1,
          showTimeDetail: showTimeDetailId,
        });
        // tính lại total
        total += parseInt(newTicker.price);
        await newTicker.save();
        // Tạo chi tiết hóa đơn
        const billDetail = new MovieBillDetail({
          movieBill: bill._id,
          ticket: newTicker._id,
        });
        await billDetail.save();
      });
      bill.total = total;
      idTicketBill = bill._id;
      await bill.save();
    }
    //#endregion

    //#region  Tạo hóa đơn combo và combo detail
    let idFoodBill = "";
    if (combos && combos.length > 0) {
      const foodBill = new FoodBill({
        user: userId,
        total: 0,
        createdAt: new Date().toISOString(),
        paymentType: payment.type,
      });

      // tạo combo detail
      let totalFoodBill = 0;
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
      foodBill.total = totalFoodBill;
      idFoodBill = foodBill._id;
      await foodBill.save();
    }
    //#endregion

    //#region render data showtime and response
    const tickets = await Ticker.find({ showTimeDetail: showTimeDetailId });
    return res.json({
      success: true,
      message: "Đặt vé thành công",
      tickets: renderObjTicket(tickets, stDetail.room, stDetail._id),
      showTimeDetail: stDetail,
      combos: combosFood,
      bills: await renderBill(
        idTicketBill === "" ? undefined : idTicketBill,
        idFoodBill === "" ? undefined : idFoodBill
      ),
    });
    //#endregion
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Lỗi 400!",
      errors: error.message,
    });
  }
});

router.get("/get-list-ticker/:id", async (req, res) => {
  try {
    const tickets = await Ticker.find({ showTimeDetail: req.params.id });
    const stDetail = await ShowTimeDetail.findById(req.params.id)
      .populate({ path: "room", populate: { path: "screen" } })
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
      message: "Lỗi 400!",
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
      message: "Lỗi 400!",
      errors: error.message,
    });
  }
});

module.exports = router;
