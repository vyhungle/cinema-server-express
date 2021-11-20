import express from "express";
const jwt = require("jsonwebtoken");
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
import Payment from "../models/Payment";
import OtpPayment from "../models/OtpPayment";
import verifyToken from "../middleware/custom";
import { paymentsData } from "../utils/data";

import {
  checkWeekend,
  createDateEX,
  renderObjTicket,
  renderStringSeat,
} from "../utils/helper";
import {
  checkMomoSuccess,
  isPayment,
  momoSend,
  renderBill,
  getTotalPayment,
} from "../utils/service";
import {
  errorCatch,
  paymentFailLink,
  paymentSuccessLink,
  POINT_BONUS,
  USER_DEFAULT,
} from "../utils/constaints";
import { mailOptionPayment, transporter } from "../config/nodeMailer";
import moment from "moment";

router.get("/test/tk", async (req, res) => {
  try {
    const std = await ShowTimeDetail.findById("618e8f1381140b0037dd343e");
    return res.json({
      ticket: {
        ...std.ticket,
        child: {
          name: "a",
        },
      },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: errorCatch,
      errors: error.message,
    });
  }
});

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
    let idTicketBill = "";
    let idFoodBill = "";
    let numberTicket = 0;
    let giftPoint = 0;
    let giftList = [];
    let priceTicket = 0;
    let discount = 0;
    let countGiftDiscount = 0;

    let totalTicket = 0;
    let totalFood = 0;

    let countTicketPoint = 0;
    let countTicketCoupon = 0;

    let totalPriceTicketPoint = 0;
    let totalPriceTicketCoupon = 0;

    let totalPriceFoodPoint = 0;
    let totalPriceFoodCoupon = 0;
    let typeTicket = 0;

    const stDetail = await ShowTimeDetail.findById(showTimeDetailId)
      .populate({
        path: "room",
        populate: [{ path: "screen" }, { path: "cinema" }],
      })
      .populate("timeSlot");
    const oldTickets = await Ticker.find({ showTimeDetail: showTimeDetailId });

    const priceBefore = checkWeekend(stDetail.date)
      ? stDetail.room.screen.weekendPrice
      : stDetail.room.screen.weekdayPrice;

    const cinema = stDetail?.room?.cinema;
    // return res.json(cinema);

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
        if (
          isTicker &&
          (isTicker.dateEx > Date.now() || isTicker.dateEx === 0)
        ) {
          console.log(
            moment(Date.now()).format("DD MM YYYY, h:mm:ss a"),
            moment(isTicker.dateEx).format("DD MM YYYY, h:mm:ss a")
          );
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
          numberTicket += gifts[i].quantity;
          // nếu vé coupon
          if (gift.coupon) {
            // tính tổng số lượng và tổng tiền vé coupon
            countTicketCoupon += gifts[i].quantity;
            totalPriceTicketCoupon +=
              data && data.length > 0 ? data[0].price : priceBefore;
          } else {
            // tính tổng số lượng và tổng tiền vé đổi điểm
            countTicketPoint += gifts[i].quantity;
            totalPriceTicketPoint +=
              data && data.length > 0 ? data[0].price : priceBefore;
          }
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

    //#region tính total bill
    if (data && data.length > 0) {
      data.forEach((item) => {
        totalTicket += item.price || priceBefore;
        priceTicket = item.price || priceBefore;
        typeTicket = item?.type || 0;
      });
    }
    // trừ vé đổi điểm và coupon
    totalTicket -= numberTicket * priceTicket;
    if (combos && combos.length > 0) {
      for (let i = 0; i < combos.length; i++) {
        const food = await Food.findById(combos[i]._id);
        totalFood += food.price * combos[i].quantity;
      }
    }
    //#endregion

    //#region thanh toán online

    if (payment.type > 0) {
      if (!cinema.payments.some((x) => x.type == payment.info.type)) {
        res.json({
          success: false,
          message:
            "Rạp chưa hỗ trợ hình thức thanh toán này, vui lòng thử lại sau",
        });
      }
      const index = cinema.payments.findIndex(
        (x) => x.type == payment.info.type
      );
      const isP = await isPayment(
        payment.info.username,
        totalFood + totalTicket,
        cinema.payments[index].user
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
      data.forEach(async (item) => {
        let newTicker = {};
        const seat = await Ticker.findOne({
          idSeat: item.idSeat,
          seatName: item.seatName,
        });
        if (seat) {
          newTicker = seat;
          seat.wail = false;
          seat.dateEX = 0;
          await seat.save();
        } else {
          newTicker = new Ticker({
            idSeat: item.idSeat,
            seatName: item.seatName,
            price: numberTicket > 0 ? 0 : item.price || priceBefore,
            status: 1,
            showTimeDetail: showTimeDetailId,
            type: item?.type || 1,
          });
        }
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
      bill.total = totalTicket - totalTicket * discount;
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
      if (combos && combos.length > 0) {
        for (let i = 0; i < combos.length; i++) {
          const food = await Food.findById(combos[i]._id);
          const foodDetail = new FoodDetail({
            food: combos[i]._id,
            foodBill: foodBill._id,
            quantity: combos[i].quantity,
            price: food.price,
          });
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

          // Tính tiền bắp nước đổi điểm và dùng coupon
          if (giftList[i].coupon) {
            totalPriceFoodCoupon += foodGift.price * giftList[i].quantity;
          } else {
            totalPriceFoodPoint += foodGift.price * giftList[i].quantity;
          }
        }
      }
      foodBill.total = totalFood - totalFood * discount;
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

    //#region Thống kê lại

    if (data) {
      stDetail.ticket = {
        adult: {
          ...stDetail.ticket.adult,
          count:
            stDetail.ticket.adult.count + (typeTicket == 1 ? data.length : 0),
          price: typeTicket == 1 ? priceTicket : stDetail.ticket.adult.price,
        },
        child: {
          ...stDetail.ticket.child,
          count:
            stDetail.ticket.child.count + (typeTicket == 0 ? data.length : 0),
          price: typeTicket == 0 ? priceTicket : stDetail.ticket.child.price,
        },
        student: {
          ...stDetail.ticket.student,
          count:
            stDetail.ticket.student.count + (typeTicket == 2 ? data.length : 0),
          price: typeTicket == 2 ? priceTicket : stDetail.ticket.student.price,
        },
        total: stDetail.ticket.total + totalTicket - totalTicket * discount,
        totalPromotion:
          stDetail.ticket.totalPromotion +
          totalPriceTicketPoint +
          totalPriceTicketCoupon +
          totalTicket * discount,
      };
    }

    if (combos) {
      for (let i = 0; i < combos.length; i++) {
        const food = await Food.findById(combos[i]._id);
        const indexCB = stDetail.food.combo.findIndex(
          (x) => x._id == combos[i]._id
        );
        if (indexCB === -1) {
          stDetail.food.combo.push({
            _id: food._id,
            name: food.name,
            count: combos[i].quantity,
            price: food.price,
          });
        } else {
          stDetail.food.combo.set(indexCB, {
            _id: food._id,
            name: food.name,
            count: stDetail.food.combo[indexCB].count + combos[i].quantity,
            price: food.price,
          });
        }
      }

      if (gifts && giftList.length > 0) {
        for (let i = 0; i < giftList.length; i++) {
          const _gift = await Gift.findById(giftList[i]._id);
          const foodGift = await Food.findById(_gift.foodId);
          const indexCB = stDetail.food.combo.findIndex(
            (x) => x._id.toString().trim() === foodGift._id.toString().trim()
          );
          if (indexCB === -1) {
            stDetail.food.combo.push({
              _id: foodGift._id,
              name: foodGift.name,
              count: giftList[i].quantity,
              price: foodGift.price,
            });
          } else {
            stDetail.food.combo.set(indexCB, {
              _id: foodGift._id,
              name: foodGift.name,
              count: stDetail.food.combo[indexCB].count + giftList[i].quantity,
              price: foodGift.price,
            });
          }

          // Tính tiền bắp nước đổi điểm và dùng coupon
          if (giftList[i].coupon) {
            totalPriceFoodCoupon += foodGift.price * giftList[i].quantity;
          } else {
            totalPriceFoodPoint += foodGift.price * giftList[i].quantity;
          }
        }
      }

      stDetail.food.total += totalFood - totalFood * discount;
      stDetail.food.totalPromotion +=
        totalPriceFoodPoint + totalPriceFoodCoupon + totalFood * discount;
    }

    stDetail.totalPrice = stDetail.food.total + stDetail.ticket.total;

    //#endregion

    //#region Xử lý email
    let paymentData = {
      type: 0,
      name: "Thanh toán tại rạp",
    };
    if (payment && payment.type > 0) {
      paymentData = paymentsData.find((x) => x.type == payment?.info?.type);
    }
    const email = user.email;
    const paymentName = paymentData.name;
    const name = user?.profile?.fullName;
    const tk = payment && payment?.username;
    const date = moment().format("DD-MM-YYYY h:mm:ss");
    const price =
      totalTicket - totalTicket * discount + totalFood - totalFood * discount;
    transporter.sendMail(
      mailOptionPayment(email, paymentName, name, tk, date, price),
      function (error, info) {}
    );
    //#endregion

    //#region render data showtime and response
    await stDetail.save();
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

router.post("/create-payment", verifyToken, async (req, res) => {
  const { typeUser, id, type } = req;
  const {
    data,
    showTimeDetailId,
    userId = USER_DEFAULT,
    payment,
    combos,
    gifts,
    coupons,
  } = req.body;
  try {
    //#region validate user
    const _userId = typeUser === 0 ? id : userId;
    const user = await User.findById(_userId);
    if (!user) {
      res.status(400).json({
        success: false,
        message: "Không tìm thấy người dùng này trong hệ thống.",
      });
    }

    //#endregion

    //#region data default
    let giftPoint = 0;
    let countGiftDiscount = 0;
    const stDetail = await ShowTimeDetail.findById(showTimeDetailId)
      .populate({
        path: "room",
        populate: [{ path: "screen" }, { path: "cinema" }],
      })
      .populate("timeSlot");
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
        if (
          isTicker &&
          (isTicker.dateEx > Date.now() || isTicker.dateEx === 0)
        ) {
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
        // type = 2 phiếu giảm giá
        if (gift.type === 2) {
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
      });
    }

    //#endregion

    //#region Tạo ghế 10p
    data.forEach(async (item) => {
      const seat = await Ticker.findOne({
        idSeat: item.idSeat,
        seatName: item.seatName,
      });
      if (seat) {
        seat.wail = true;
        seat.dateEx = createDateEX(undefined, undefined, 10);
        await seat.save();
      } else {
        const newTicker = new Ticker({
          idSeat: item.idSeat,
          seatName: item.seatName,
          price: item.price || priceBefore,
          status: 1,
          showTimeDetail: showTimeDetailId,
          type: item?.type || 1,
          wail: true,
          dateEx: createDateEX(undefined, undefined, 10),
        });
        await newTicker.save();
      }
    });
    //#endregion

    const resMOMO = await momoSend({
      data,
      showTimeDetailId,
      userId: _userId,
      payment,
      combos,
      gifts,
      coupons,
      total: await getTotalPayment(gifts, data, combos),
    });
    if (resMOMO.resultCode == 0) {
      return res.json({
        success: true,
        message: "Tạo thanh toán thành công",
        uri: resMOMO.payUrl,
      });
    }
    return res.json({
      success: false,
      message: errorCatch,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: errorCatch,
      errors: error.message,
    });
  }
});

router.get("/success-payment", async (req, res) => {
  const { token, orderId, requestId } = req.query;

  const decoded = jwt.verify(token, process.env.SECRET_KEY);
  const { data, showTimeDetailId, userId, payment, combos, gifts, coupons } =
    decoded;
  try {
    const checkOrder = await checkMomoSuccess(orderId, requestId);
    if (checkOrder) {
      //#region validate user
      const user = await User.findById(userId);
      if (!user) {
        console.log("error");
        return res.redirect(paymentFailLink);
      }
      console.log(user);

      //#endregion

      //#region data default
      let idTicketBill = "";
      let idFoodBill = "";
      let numberTicket = 0;
      let giftPoint = 0;
      let giftList = [];
      let priceTicket = 0;
      let discount = 0;
      let countGiftDiscount = 0;

      let totalTicket = 0;
      let totalFood = 0;

      let countTicketPoint = 0;
      let countTicketCoupon = 0;

      let totalPriceTicketPoint = 0;
      let totalPriceTicketCoupon = 0;

      let totalPriceFoodPoint = 0;
      let totalPriceFoodCoupon = 0;
      let typeTicket = 0;

      const stDetail = await ShowTimeDetail.findById(showTimeDetailId)
        .populate({
          path: "room",
          populate: [{ path: "screen" }, { path: "cinema" }],
        })
        .populate("timeSlot");
      const oldTickets = await Ticker.find({
        showTimeDetail: showTimeDetailId,
      });

      const priceBefore = checkWeekend(stDetail.date)
        ? stDetail.room.screen.weekendPrice
        : stDetail.room.screen.weekdayPrice;

      // return res.json(cinema);

      //#endregion

      //#region kiểm tra gift point và số lượng phiếu giảm giá
      for (let i = 0; i < gifts.length; i++) {
        const gift = await Gift.findById(gifts[i]._id);
        if (gift) {
          // type = 0 loại vé
          if (gift.type === 0) {
            numberTicket += gifts[i].quantity;
            // nếu vé coupon
            if (gift.coupon) {
              // tính tổng số lượng và tổng tiền vé coupon
              countTicketCoupon += gifts[i].quantity;
              totalPriceTicketCoupon +=
                data && data.length > 0 ? data[0].price : priceBefore;
            } else {
              // tính tổng số lượng và tổng tiền vé đổi điểm
              countTicketPoint += gifts[i].quantity;
              totalPriceTicketPoint +=
                data && data.length > 0 ? data[0].price : priceBefore;
            }
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
        return res.redirect(paymentFailLink);
      }
      if (countGiftDiscount > 1) {
        return res.redirect(paymentFailLink);
      }
      //#endregion

      //#region tính total bill
      if (data && data.length > 0) {
        data.forEach((item) => {
          totalTicket += item.price || priceBefore;
          priceTicket = item.price || priceBefore;
          typeTicket = item?.type || 0;
        });
      }
      // trừ vé đổi điểm và coupon
      totalTicket -= numberTicket * priceTicket;
      if (combos && combos.length > 0) {
        for (let i = 0; i < combos.length; i++) {
          const food = await Food.findById(combos[i]._id);
          totalFood += food.price * combos[i].quantity;
        }
      }
      //#endregion

      //#region  Tạo hóa đơn vé và vé
      if (data && data.length > 0) {
        const bill = new MovieBill({
          user: userId,
          total: 0,
          createdAt: new Date().toISOString(),
          paymentType: payment.type,
        });

        // tạo vé
        data.forEach(async (item) => {
          const newTicker = await Ticker.findOne({
            idSeat: item.idSeat,
            seatName: item.seatName,
          });
          newTicker.wail = false;
          newTicker.dateEx = 0;
          // trừ vé free
          numberTicket -= 1;
          await newTicker.save();
          // Tạo chi tiết hóa đơn
          const billDetail = new MovieBillDetail({
            movieBill: bill._id,
            ticket: newTicker._id,
          });
          await billDetail.save();
          console.log("seat success", newTicker);
        });
        // tính lại total bill
        bill.total = totalTicket - totalTicket * discount;
        idTicketBill = bill._id;
        await bill.save();
      }
      //#endregion

      //#region  Tạo hóa đơn combo và combo detail
      if ((combos && combos.length > 0) || (gifts && giftList.length > 0)) {
        const foodBill = new FoodBill({
          user: userId,
          total: 0,
          createdAt: new Date().toISOString(),
          paymentType: payment.type,
        });

        // tạo combo detail
        if (combos && combos.length > 0) {
          for (let i = 0; i < combos.length; i++) {
            const food = await Food.findById(combos[i]._id);
            const foodDetail = new FoodDetail({
              food: combos[i]._id,
              foodBill: foodBill._id,
              quantity: combos[i].quantity,
              price: food.price,
            });
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

            // Tính tiền bắp nước đổi điểm và dùng coupon
            if (giftList[i].coupon) {
              totalPriceFoodCoupon += foodGift.price * giftList[i].quantity;
            } else {
              totalPriceFoodPoint += foodGift.price * giftList[i].quantity;
            }
          }
        }
        foodBill.total = totalFood - totalFood * discount;
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
      if (userId != USER_DEFAULT) {
        const userPoint = await User.findById(userId);
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

      //#region Thống kê lại

      if (data) {
        stDetail.ticket = {
          adult: {
            ...stDetail.ticket.adult,
            count:
              stDetail.ticket.adult.count + (typeTicket == 1 ? data.length : 0),
            price: typeTicket == 1 ? priceTicket : stDetail.ticket.adult.price,
          },
          child: {
            ...stDetail.ticket.child,
            count:
              stDetail.ticket.child.count + (typeTicket == 0 ? data.length : 0),
            price: typeTicket == 0 ? priceTicket : stDetail.ticket.child.price,
          },
          student: {
            ...stDetail.ticket.student,
            count:
              stDetail.ticket.student.count +
              (typeTicket == 2 ? data.length : 0),
            price:
              typeTicket == 2 ? priceTicket : stDetail.ticket.student.price,
          },
          total: stDetail.ticket.total + totalTicket - totalTicket * discount,
          totalPromotion:
            stDetail.ticket.totalPromotion +
            totalPriceTicketPoint +
            totalPriceTicketCoupon +
            totalTicket * discount,
        };
      }

      if (combos) {
        for (let i = 0; i < combos.length; i++) {
          const food = await Food.findById(combos[i]._id);
          const indexCB = stDetail.food.combo.findIndex(
            (x) => x._id == combos[i]._id
          );
          if (indexCB === -1) {
            stDetail.food.combo.push({
              _id: food._id,
              name: food.name,
              count: combos[i].quantity,
              price: food.price,
            });
          } else {
            stDetail.food.combo.set(indexCB, {
              _id: food._id,
              name: food.name,
              count: stDetail.food.combo[indexCB].count + combos[i].quantity,
              price: food.price,
            });
          }
        }

        if (gifts && giftList.length > 0) {
          for (let i = 0; i < giftList.length; i++) {
            const _gift = await Gift.findById(giftList[i]._id);
            const foodGift = await Food.findById(_gift.foodId);
            const indexCB = stDetail.food.combo.findIndex(
              (x) => x._id.toString().trim() === foodGift._id.toString().trim()
            );
            if (indexCB === -1) {
              stDetail.food.combo.push({
                _id: foodGift._id,
                name: foodGift.name,
                count: giftList[i].quantity,
                price: foodGift.price,
              });
            } else {
              stDetail.food.combo.set(indexCB, {
                _id: foodGift._id,
                name: foodGift.name,
                count:
                  stDetail.food.combo[indexCB].count + giftList[i].quantity,
                price: foodGift.price,
              });
            }

            // Tính tiền bắp nước đổi điểm và dùng coupon
            if (giftList[i].coupon) {
              totalPriceFoodCoupon += foodGift.price * giftList[i].quantity;
            } else {
              totalPriceFoodPoint += foodGift.price * giftList[i].quantity;
            }
          }
        }

        stDetail.food.total += totalFood - totalFood * discount;
        stDetail.food.totalPromotion +=
          totalPriceFoodPoint + totalPriceFoodCoupon + totalFood * discount;
      }

      stDetail.totalPrice = stDetail.food.total + stDetail.ticket.total;

      //#endregion

      //#region Xử lý email

      const email = user.email;
      const paymentName = "Ví Momo";
      const name = user?.profile?.fullName;
      const tk = payment && payment?.username;
      const date = moment().format("DD-MM-YYYY h:mm:ss");
      const price =
        totalTicket - totalTicket * discount + totalFood - totalFood * discount;
      transporter.sendMail(
        mailOptionPayment(email, paymentName, name, tk, date, price),
        function (error, info) {}
      );
      //#endregion

      //#region render data showtime and response
      await stDetail.save();
      return res.redirect(paymentSuccessLink);
      //#endregion
    }
    return res.redirect(paymentFailLink);
  } catch (error) {
    // return res.redirect(paymentFailLink);
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
