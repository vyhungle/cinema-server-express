import cc from "coupon-code";
import crypto from "crypto";

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
import { filterTimeSTD, generateToken, parseTime } from "./helper";
import { mailOption, transporter } from "../config/nodeMailer";
import axios from "axios";
import moment from "moment";
import { time } from "console";

export const getMoviePlay = async () => {
  const res = {
    moviePlay: [],
    movieComing: [],
    movieEx: [],
  };
  const movie = await Movie.find();

  movie.forEach((item) => {
    const dateStart = new Date(item.dateStart);
    const dateEnd = new Date(item.dateEnd);
    const dateNow = Date.now();
    if (dateStart < dateNow && dateEnd > dateNow) {
      res.moviePlay.push(item);
    } else if (dateStart > dateNow) {
      res.movieComing.push(item);
    } else {
      res.movieEx.push(item);
    }
  });
  return res;
};

export const getMoviePlayCMS = async () => {
  let res = [
    {
      movieGroupName: "Phim đang chiếu",
      movies: [],
    },
    {
      movieGroupName: "Phim sắp chiếu",
      movies: [],
    },
  ];

  const movie = await Movie.find();

  movie.forEach((item) => {
    const dateStart = new Date(item.dateStart);
    const dateEnd = new Date(item.dateEnd);
    const dateNow = Date.now();
    if (dateStart < dateNow && dateEnd > dateNow) {
      res[0].movies = [...res[0].movies, item];
    } else if (dateStart > dateNow) {
      res[1].movies = [...res[1].movies, item];
    }
  });
  return res;
};

export const sendEmail = (email, id) => {
  const link = `https://server-api-cinema.herokuapp.com/api/auth/accept-token/${id}`;
  transporter.sendMail(mailOption(email, link), function (error, info) {});
};

export const isPayment = async (username, total, cinemaUser) => {
  const payment = await Payment.findOne({ username });
  const cinemaPayment = await Payment.findOne({ username: cinemaUser });
  if (payment && cinemaPayment) {
    if (total && payment.money >= total) {
      payment.money -= total;
      cinemaPayment.money += total;
      await payment.save();
      await cinemaPayment.save();
      return {
        message: "Thanh toán thành công.",
        success: true,
      };
    } else if (payment.money < total) {
      return {
        message:
          "Tài khoảng của quý khách không đủ ${total}, để thanh toán vui lòng nạp thêm tiền vào tài khoản.",
        success: false,
      };
    } else {
      return { message: "Tài khoản thanh toán không hợp lệ.", success: false };
    }
  }
  return { message: "Tài khoản thanh toán không hợp lệ.", success: false };
};

const getItemMovieBill = (values) => {
  let res = [];
  values.forEach((item) => {
    res = [...res, item.ticket];
  });
  return res;
};

export const mergeMovieBill = async (values) => {
  let res = [];
  for (let i = 0; i < values.length; i++) {
    const billDetail = await MovieBillDetail.find({
      movieBill: values[i]._id,
    }).populate({
      path: "ticket",
      populate: {
        path: "showTimeDetail",
        populate: [
          { path: "showTime", populate: ["movie", "cinema"] },
          { path: "timeSlot" },
          { path: "room" },
        ],
      },
    });

    if (!res.some((x) => x.bill._id === values[i]._id)) {
      res.push({
        bill: values[i],
        type: 0,
        data: getItemMovieBill(await billDetail),
      });
    } else {
      const index = res.findIndex((x) => x.bill._id === values[i]._id);
      res[index] = {
        ...res[index],
        data: res[index].data.concat(getItemMovieBill(await billDetail)),
      };
    }
  }

  return res;
};

const getItemFoodBill = (values) => {
  let res = [];
  values.forEach((item) => {
    res = [
      ...res,
      { ...item.food._doc, price: item.price, quantity: item.quantity },
    ];
  });
  return res;
};

export const mergeFoodBill = async (values) => {
  let res = [];
  for (let i = 0; i < values.length; i++) {
    const billDetail = await FoodDetail.find({
      foodBill: values[i]._id,
    }).populate("food");

    if (!res.some((x) => x.bill._id === values[i]._id)) {
      res.push({
        bill: values[i],
        type: 1,
        data: getItemFoodBill(await billDetail),
      });
    } else {
      const index = res.findIndex((x) => x.bill._id === values[i]._id);
      res[index] = {
        ...res[index],
        data: res[index].data.concat(getItemFoodBill(await billDetail)),
      };
    }
  }

  return res;
};

export const renderBill = async (idTicketBill, idFoodBill) => {
  let res = {
    date: new Date().toISOString(),
  };
  if (idTicketBill) {
    const tkBill = await MovieBill.findById(idTicketBill);
    const tkBillDetail = await MovieBillDetail.find({
      movieBill: idTicketBill,
    }).populate("ticket");
    res.ticketBill = {
      bill: tkBill,
      data: getItemMovieBill(tkBillDetail),
    };
  }
  if (idFoodBill) {
    const foodBill = await FoodBill.findById(idFoodBill);
    const foodBillDetail = await FoodDetail.find({
      foodBill: idFoodBill,
    }).populate("food");
    res.foodBill = {
      bill: foodBill,
      data: getItemFoodBill(foodBillDetail),
    };
  }

  return res;
};

export const createCoupon = async (userId, giftId) => {
  const user = await User.findById(userId);
  const gift = await Gift.findById(giftId);
  // đính điểm cho data
  let point = gift.point;
  if (user.point < point) {
    return {
      success: false,
      message:
        "Bạn không đủ điểm để đổi coupon này, vui lòng chọn quà khác hoặc tính điểm thêm.",
    };
  }
  if (!gift) {
    return {
      success: false,
      message: "Không tìm thấy quà tặng này, vui lòng lại sau.",
    };
  }
  // add coupon
  const dateNow = new Date().toISOString();
  const coupon = new Coupon({
    code: cc.generate(),
    createAt: dateNow,
    pointTotal: point,
    dateExpiry: new Date(dateNow).setDate(new Date(dateNow).getDate() + 7),
    user: user._id,
    gift: gift._id,
    status: 0,
  });
  await coupon.save();

  // trừ điểm
  user.point -= point;
  user.save();
  return {
    success: true,
    message: "Đổi coupon thành công.",
    values: {
      coupon: await Coupon.findById(coupon._id).populate("gift"),
    },
  };
};

export const getCoupon = async (userId, code, page, limit) => {
  if (code) {
    const coupon = await Coupon.findOne({ code, user: userId }).populate(
      "gift"
    );
    return {
      success: coupon ? true : false,
      coupon,
    };
  } else {
    const coupons = await Coupon.find({ user: userId })
      .populate([
        {
          path: "gift",
        },
        {
          path: "user",
        },
      ])
      .sort({ createdAt: -1 })
      .limit(parseInt(limit, 10))
      .skip((parseInt(page, 10) - 1) * parseInt(limit, 10))
      .exec();
    return coupons;
  }
};

export const revenueStatistics = async () => {
  const list = [];

  // Pạp phim
  const cinema = await Cinema.find();
  for (let i = 0; i < cinema.length; i++) {
    list.push({
      cinema: cinema[i],
      showTimes: [],
    });
    // Lịch chiếu
    const showTimes = await ShowTime.find({ cinema: cinema[i]._id });

    for (let j = 0; j < showTimes.length; j++) {
      list[i].showTimes.push({
        showTime: showTimes[j],
        showDetails: [],
      });
      // Chi tiết lịch chiếu
      const showDetails = await ShowTimeDetail.find({
        showTime: showTimes[j]._id,
      });
      for (let k = 0; k < showDetails.length; k++) {
        list[i].showTimes[j].showDetails.push({
          showDetail: showDetails[k],
          ticket: await Ticker.find({ showTimeDetail: showDetails[k]._id }),
        });
      }
    }
  }

  return list;
};

export const revenueStatisticsByDate = async (cinemaId, dateStart, dateEnd) => {
  const showTimes = await ShowTime.find({ cinema: cinemaId });
  let showTimeDetails = [];

  // get show time detail
  for (let i = 0; i < showTimes.length; i++) {
    const std = await ShowTimeDetail.find({ showTime: showTimes[i]._id });
    std.forEach((item) => {
      item.movieId = showTimes[i].movie;
    });
    showTimeDetails = showTimeDetails.concat(std);
  }
  const filterSTD = filterTimeSTD(showTimeDetails, dateStart, dateEnd);
  const res = mergeSTD(filterSTD);

  const rooms = await Room.find({ cinema: cinemaId });
  const timeSlots = await TimeSlot.find();
  const sortTimeSL = timeSlots.sort(
    (a, b) => parseTime(a.time) - parseTime(b.time)
  );
  const movie = await Movie.find();

  for (let i = 0; i < res.length; i++) {
    res[i].rooms = await mergeSTDRoom(filterSTD, rooms, sortTimeSL);
    res[i].movies = await mergeSTDMovie(filterSTD, movie);
    res[i].timeSlots = await mergeSTDTimeSlot(filterSTD, sortTimeSL);
  }
  return res;
};

export const mergeSTD = (showDetails) => {
  const res = [];
  showDetails.forEach((item, index) => {
    const is = res.some((x) => x.date == item.date);
    if (!is) {
      res.push({
        date: item.date,
        countTicket: item?.countTicket || 0,
        countTicketCoupon: item?.countTicketCoupon || 0,
        countTicketPoint: item?.countTicketPoint || 0,

        totalPriceFood: item?.totalPriceFood || 0,
        totalPriceFoodCoupon: item?.totalPriceFoodCoupon || 0,
        totalPriceFoodPoint: item?.totalPriceFoodPoint || 0,

        totalPriceTicket: item?.totalPriceTicket || 0,
        totalPriceTicketCoupon: item?.totalPriceTicketCoupon || 0,
        totalPriceTicketPoint: item?.totalPriceTicketPoint || 0,
        totalPrice: item?.totalPriceFood || 0 + item?.totalPriceTicket || 0,
        countAdultTicket: item?.countAdultTicket || 0,
        countChildTicket: item?.countChildTicket || 0,
        countStudentTicket: item?.countStudentTicket || 0,
      });
    } else {
      const index = res.findIndex((x) => x.date == item.date);
      res[index] = {
        ...res[index],
        countTicket: res[index].countTicket + item.countTicket,
        countTicketCoupon:
          res[index].countTicketCoupon + item.countTicketCoupon,
        countTicketPoint: res[index].countTicketPoint + item.countTicketPoint,

        totalPriceFood: res[index].totalPriceFood + item.totalPriceFood,
        totalPriceFoodCoupon:
          res[index].totalPriceFoodCoupon + item.totalPriceFoodCoupon,
        totalPriceFoodPoint:
          res[index].totalPriceFoodPoint + item.totalPriceFoodPoint,

        totalPriceTicket: res[index].totalPriceTicket + item.totalPriceTicket,
        totalPriceTicketCoupon:
          res[index].totalPriceTicketCoupon + item.totalPriceTicketCoupon,
        totalPriceTicketPoint:
          res[index].totalPriceTicketPoint + item.totalPriceTicketPoint,
        totalPrice:
          res[index].totalPriceTicket +
          item.totalPriceTicket +
          res[index].totalPriceFood +
          item.totalPriceFood,
        countAdultTicket: res[index].countAdultTicket + item.countAdultTicket,
        countChildTicket: res[index].countChildTicket + item.countChildTicket,
        countStudentTicket:
          res[index].countStudentTicket + item.countStudentTicket,
      };
    }
  });
  return res;
};

const mergeSTDRoom = (showTimeDetails, rooms, timeSlot) => {
  let res = [];
  for (let i = 0; i < rooms.length; i++) {
    const std = showTimeDetails.filter(
      (x) => x.room.toString() == rooms[i]._id.toString()
    );
    res.push({
      room: rooms[i],
      ...mergeSTDDefault(std),
      // timeSlots: mergeSTDTimeSlot(showTimeDetails, timeSlot, rooms[i]._id),
    });
  }
  return res;
};

const mergeSTDTimeSlot = (showTimeDetails, timeSlots, roomId) => {
  let res = [];
  for (let i = 0; i < timeSlots.length; i++) {
    let std = [];
    if (roomId) {
      std = showTimeDetails.filter(
        (x) =>
          x.timeSlot.toString() == timeSlots[i]._id.toString() &&
          x.room.toString() == roomId.toString()
      );
    } else {
      std = showTimeDetails.filter(
        (x) => x.timeSlot.toString() == timeSlots[i]._id.toString()
      );
    }
    res.push({
      timeSlot: timeSlots[i],
      ...mergeSTDDefault(std),
    });
  }
  return res;
};

const mergeSTDMovie = (showTimeDetails, movies) => {
  let res = [];
  for (let i = 0; i < movies.length; i++) {
    const std = showTimeDetails.filter(
      (x) => x.movieId.toString() == movies[i]._id.toString()
    );
    res.push({
      movie: movies[i],
      ...mergeSTDDefault(std),
    });
  }
  return res;
};

const mergeSTDDefault = (showTimeDetails) => {
  let countTicket = 0;
  let countTicketCoupon = 0;
  let countTicketPoint = 0;
  let totalPriceFood = 0;
  let totalPriceFoodCoupon = 0;
  let totalPriceFoodPoint = 0;
  let totalPriceTicket = 0;
  let totalPriceTicketCoupon = 0;
  let totalPriceTicketPoint = 0;
  let countChildTicket = 0;
  let countAdultTicket = 0;
  let countStudentTicket = 0;

  for (let j = 0; j < showTimeDetails.length; j++) {
    countTicket += showTimeDetails[j]?.countTicket || 0;
    countTicketCoupon += showTimeDetails[j]?.countTicketCoupon || 0;
    countTicketPoint += showTimeDetails[j]?.countTicketPoint || 0;

    totalPriceFood += showTimeDetails[j]?.totalPriceFood || 0;
    totalPriceFoodCoupon += showTimeDetails[j]?.totalPriceFoodCoupon || 0;
    totalPriceFoodPoint += showTimeDetails[j]?.totalPriceFoodPoint || 0;

    totalPriceTicket += showTimeDetails[j]?.totalPriceTicket || 0;
    totalPriceTicketCoupon += showTimeDetails[j]?.totalPriceTicketCoupon || 0;
    totalPriceTicketPoint += showTimeDetails[j]?.totalPriceTicketPoint || 0;
    countAdultTicket += showTimeDetails[j]?.countAdultTicket || 0;
    countChildTicket += showTimeDetails[j]?.countChildTicket || 0;
    countStudentTicket += showTimeDetails[j]?.countStudentTicket || 0;
  }

  return {
    countTicket,
    countTicketCoupon,
    countTicketPoint,
    totalPriceFood,
    totalPriceFoodCoupon,
    totalPriceFoodPoint,
    totalPriceTicket,
    totalPriceTicketCoupon,
    totalPriceTicketPoint,
    totalPrice: totalPriceFood + totalPriceTicket,
    countAdultTicket,
    countChildTicket,
    countStudentTicket,
  };
};

export const revenueYear = async (cinemaId, year) => {
  const dateStart = moment(`1/1/${year}`, "MM-DD-YYYY").format();
  const dateEnd = moment(
    `1/1/${parseInt(year, 10) + 1}`,
    "MM-DD-YYYY"
  ).format();
  const dataFood = await FoodBill.find({
    createdAt: {
      $gte: dateStart,
      $lte: dateEnd,
    },
    cinema: cinemaId,
  });
  const dataTicket = await MovieBill.find({
    createdAt: {
      $gte: dateStart,
      $lte: dateEnd,
    },
    cinema: cinemaId,
  });

  const yearData = [
    {
      quarter: 1,
      months: [1, 2, 3],
      totalFood: 0,
      totalTicket: 0,
      totalPrice: 0,
      totalPromotion: 0,
    },
    {
      quarter: 2,
      months: [4, 5, 6],
      totalFood: 0,
      totalTicket: 0,
      totalPrice: 0,
      totalPromotion: 0,
    },
    {
      quarter: 3,
      months: [7, 8, 9],
      totalFood: 0,
      totalTicket: 0,
      totalPrice: 0,
      totalPromotion: 0,
    },
    {
      quarter: 4,
      months: [10, 11, 12],
      totalFood: 0,
      totalTicket: 0,
      totalPrice: 0,
      totalPromotion: 0,
    },
  ];

  dataFood.forEach((item) => {
    const month = new Date(moment(item.createdAt).format()).getMonth() + 1;
    const index = yearData.findIndex((x) => x.months.some((x) => x == month));
    if (index !== -1) {
      yearData[index].totalFood += item.total;
      yearData[index].totalPrice += item.total;
      yearData[index].totalPromotion += item.promotion;
    }
  });

  dataTicket.forEach((item) => {
    const month = new Date(item.createdAt).getMonth() + 1;
    const index = yearData.findIndex((x) => x.months.some((x) => x == month));
    if (index !== -1) {
      yearData[index].totalTicket += item.total;
      yearData[index].totalPrice += item.total;
      yearData[index].totalPromotion += item.promotion;
    }
  });

  return yearData;
};

export const momoSend = async (data) => {
  const tokenOrder = generateToken(data);
  let info = "";
  data.data.forEach((item, index) => {
    if (data.data.length === 1) {
      info += `Ghế ${item.seatName}. `;
    } else if (index === 0) {
      info += `Ghế ${item.seatName}, `;
    } else if (index === data.data.length - 1) {
      info += `${item.seatName}. `;
    } else {
      info += `${item.seatName}, `;
    }
  });
  for (let i = 0; i < data.combos.length; i++) {
    const food = await Food.findById(data.combos[i]._id);
    if (data.combos.length === 1) {
      info += `${food.name}. `;
    } else if (i === 0) {
      info += `${food.name}, `;
    } else if (i === data.combos.length - 1) {
      info += `${food.name}. `;
    } else {
      info += `${food.name}, `;
    }
  }

  var partnerCode = process.env.MOMO_PARTNER_CODE;
  var accessKey = process.env.MOMO_ACCESS_KEY;
  var secretkey = process.env.MOMO_SECRET_KEY;
  var requestId = partnerCode + new Date().getTime();
  var orderId = requestId;
  var orderInfo = info;
  var redirectUrl = `https://server-api-cinema.herokuapp.com/api/ticker/success-payment?token=${tokenOrder}`;
  var ipnUrl = "https://callback.url/notify";
  var amount = data.total;
  var requestType = "captureWallet";
  var extraData = ""; //pass empty value if your merchant does not have stores
  var rawSignature =
    "accessKey=" +
    accessKey +
    "&amount=" +
    amount +
    "&extraData=" +
    extraData +
    "&ipnUrl=" +
    ipnUrl +
    "&orderId=" +
    orderId +
    "&orderInfo=" +
    orderInfo +
    "&partnerCode=" +
    partnerCode +
    "&redirectUrl=" +
    redirectUrl +
    "&requestId=" +
    requestId +
    "&requestType=" +
    requestType;
  //puts raw signature
  //signature
  var signature = crypto
    .createHmac("sha256", secretkey)
    .update(rawSignature)
    .digest("hex");

  const requestBody = {
    partnerCode: partnerCode,
    accessKey: accessKey,
    requestId: requestId,
    amount: amount,
    orderId: orderId,
    orderInfo: orderInfo,
    redirectUrl: redirectUrl,
    ipnUrl: ipnUrl,
    extraData: extraData,
    requestType: requestType,
    signature: signature,
    lang: "vi",
  };

  const response = await axios.post(
    "https://test-payment.momo.vn/v2/gateway/api/create",
    requestBody
  );

  return response.data;
};

export const checkMomoSuccess = async (orderId, requestId) => {
  var partnerCode = process.env.MOMO_PARTNER_CODE;
  var accessKey = process.env.MOMO_ACCESS_KEY;
  var secretkey = process.env.MOMO_SECRET_KEY;
  var rawSignature =
    "accessKey=" +
    accessKey +
    "&orderId=" +
    orderId +
    "&partnerCode=" +
    partnerCode +
    "&requestId=" +
    requestId;

  //puts raw signature
  //signature
  const crypto = require("crypto");
  var signature = crypto
    .createHmac("sha256", secretkey)
    .update(rawSignature)
    .digest("hex");

  const requestBody = {
    partnerCode: partnerCode,
    requestId: requestId,
    orderId: orderId,
    signature: signature,
    lang: "vi",
  };
  console.log(requestBody);
  const response = await axios.post(
    "https://test-payment.momo.vn/v2/gateway/api/query",
    requestBody
  );
  console.log(response.data);
  if (response.data.resultCode == 0) {
    return true;
  }
  return false;
};

export const getTotalPayment = async (gifts, data, combos) => {
  let numberTicket = 0;
  let priceTicket = 0;
  let discount = 0;
  let totalTicket = 0;
  let totalFood = 0;

  //#region kiểm tra gift point và số lượng phiếu giảm giá
  for (let i = 0; i < gifts.length; i++) {
    const gift = await Gift.findById(gifts[i]._id);
    if (gift) {
      // type = 0 loại vé
      if (gift.type === 0) {
        numberTicket += gifts[i].quantity;
      }
      // type = 2 phiếu giảm giá
      else if (gift.type === 2) {
        discount = gift.discount;
      }
    }
  }
  //#endregion

  //#region tính total bill
  if (data && data.length > 0) {
    data.forEach((item) => {
      totalTicket += item.price || priceBefore;
      priceTicket = item.price || priceBefore;
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

  return totalFood + totalTicket - (totalFood + totalTicket) * discount;
};

export const thongKeRapTheoQuy = async (year) => {
  const dateStart = moment(`1/1/${year}`, "MM-DD-YYYY").format();
  const dateEnd = moment(
    `1/1/${parseInt(year, 10) + 1}`,
    "MM-DD-YYYY"
  ).format();
  const dataFood = await FoodBill.find({
    createdAt: {
      $gte: dateStart,
      $lte: dateEnd,
    },
  });
  const dataTicket = await MovieBill.find({
    createdAt: {
      $gte: dateStart,
      $lte: dateEnd,
    },
  });

  const yearData = [
    {
      quarter: 1,
      months: [1, 2, 3],
      totalFood: 0,
      totalTicket: 0,
      totalPrice: 0,
      totalPromotion: 0,
    },
    {
      quarter: 2,
      months: [4, 5, 6],
      totalFood: 0,
      totalTicket: 0,
      totalPrice: 0,
      totalPromotion: 0,
    },
    {
      quarter: 3,
      months: [7, 8, 9],
      totalFood: 0,
      totalTicket: 0,
      totalPrice: 0,
      totalPromotion: 0,
    },
    {
      quarter: 4,
      months: [10, 11, 12],
      totalFood: 0,
      totalTicket: 0,
      totalPrice: 0,
      totalPromotion: 0,
    },
  ];

  dataFood.forEach((item) => {
    const month = new Date(moment(item.createdAt).format()).getMonth() + 1;
    const index = yearData.findIndex((x) => x.months.some((x) => x == month));
    if (index !== -1) {
      yearData[index].totalFood += item.total;
      yearData[index].totalPrice += item.total;
      yearData[index].totalPromotion += item.promotion;
    }
  });

  dataTicket.forEach((item) => {
    const month = new Date(item.createdAt).getMonth() + 1;
    const index = yearData.findIndex((x) => x.months.some((x) => x == month));
    if (index !== -1) {
      yearData[index].totalTicket += item.total;
      yearData[index].totalPrice += item.total;
      yearData[index].totalPromotion += item.promotion;
    }
  });
  return yearData;
};

export const thongKeTheoNgay = async (cinemaId, date) => {
  let fb = await getFoodBill(cinemaId, date);
  let mb = await getMovieBill(cinemaId, date);

  const lstFood = await getListFoodBillDetail(fb);
  const lstTicket = await getListMovieBillDetail(mb);

  const lstBill = [...lstFood.data, ...mergeTicketBill(lstTicket.data)];
  const total = lstFood.total + lstTicket.total;
  const promotion = lstFood.promotion + lstTicket.promotion;
  const lstSort = lstBill.sort((a, b) => {
    if (a.movieName < b.movieName) {
      return -1;
    }
    if (a.movieName > b.movieName) {
      return 1;
    }
    return 0;
  });

  return {
    data: lstSort,
    total,
    promotion,
  };
};

const mergeTicketBill = (lstTicket) => {
  let res = [];
  lstTicket.forEach((item) => {
    const index = res.findIndex(
      (x) => x.billId === item.billId && x.type === item.type
    );
    if (index !== -1) {
      res[index].quantity += item.quantity;
      res[index].total += item.total;
      res[index].promotion += item.promotion;
    } else {
      res.push(item);
    }
  });
  return res;
};

const getFoodBill = async (cinemaId, date) => {
  const fb = await FoodBill.find({ cinema: cinemaId });
  const tam = fb.filter(
    (x) => moment(x.createdAt).format("MM/DD/YYYY") === date
  );
  tam.forEach((item, index) => {
    tam[index] = {
      _id: item._id,
      billId: item.billId,
      total: item.total,
      movieName: item?.movieName,
      roomName: item?.roomName,
      screenName: item?.screenName,
      createdAt: item.createdAt,
    };
  });
  return tam;
};

const getMovieBill = async (cinemaId, date) => {
  const mb = await MovieBill.find({ cinema: cinemaId });
  let tam = mb.filter((x) => moment(x.createdAt).format("MM/DD/YYYY") === date);
  tam.forEach((item, index) => {
    tam[index] = {
      _id: item._id,
      billId: item.billId,
      total: item.total,
      movieName: item?.movieName,
      roomName: item?.roomName,
      screenName: item?.screenName,
      createdAt: item.createdAt,
    };
  });
  return tam;
};

const getListFoodBillDetail = async (fb, merge) => {
  let res = {
    data: [],
    total: 0,
    promotion: 0,
  };
  for (let i = 0; i < fb.length; i++) {
    const fbd = await FoodDetail.find({ foodBill: fb[i]._id }).populate("food");
    if (fbd) {
      const lstFood = [];
      fbd.forEach((item) => {
        lstFood.push({
          billId: merge ? undefined : fb[i].billId,
          type: item.food.name,
          quantity: item.quantity,
          price: item.price,
          total: item.price * item.quantity,
          promotion: item.promotion,
          movieName: fb[i].movieName,
          roomName: fb[i].roomName,
          screenName: fb[i].screenName,
          createdAt: fb[i].createdAt,
          date: moment(fb[i].createdAt).format("DD/MM/YYYY"),
        });
        res.total += item.priceSell * item.quantity;
        res.promotion += item.promotion;
      });
      res.data = res.data.concat(lstFood);
    }
  }
  return res;
};

const getTypeTicket = (type) => {
  if (type === 0) {
    return "Vé trẻ em";
  } else if (type == 1) {
    return "Vé người lớn";
  }
  return "Vé sinh viên";
};

const getListMovieBillDetail = async (mb, merge) => {
  let res = {
    data: [],
    total: 0,
    promotion: 0,
  };
  for (let i = 0; i < mb.length; i++) {
    const mbd = await MovieBillDetail.find({ movieBill: mb[i]._id }).populate(
      "ticket"
    );
    if (mbd) {
      const lstTicket = [];
      mbd.forEach((item) => {
        const some = lstTicket.some(
          (x) =>
            x.type === getTypeTicket(item.ticket.type) &&
            x.price === item.ticket.price
        );
        if (!some) {
          lstTicket.push({
            billId: merge ? undefined : mb[i].billId,
            type: getTypeTicket(item.ticket.type),
            quantity: 1,
            price: item.price,
            total: item.priceSell,
            promotion: item.promotion,
            movieName: mb[i].movieName,
            roomName: mb[i].roomName,
            screenName: mb[i].screenName,
            createdAt: mb[i].createdAt,
            date: moment(mb[i].createdAt).format("DD/MM/YYYY"),
          });
        } else {
          const index = lstTicket.findIndex(
            (x) =>
              x.type === getTypeTicket(item.ticket.type) &&
              x.price === item.ticket.price
          );
          lstTicket[index].quantity += 1;
          lstTicket[index].total += item.priceSell;
        }

        res.total += item.priceSell;
        res.promotion += item.price;
      });
      res.data = res.data.concat(lstTicket);
    }
  }
  return res;
};

const mergeTicket = (lstTicket) => {
  let res = [];
  lstTicket.forEach((item) => {
    const index = res.findIndex(
      (x) =>
        x.movieName === item.movieName &&
        x.roomName === item.roomName &&
        x.type === item.type &&
        x.date === item.date
    );
    if (index !== -1) {
      res[index].quantity += item.quantity;
      res[index].total += item.total;
      res[index].promotion += item.promotion;
    } else {
      res.push(item);
    }
  });
  return res;
};
const mergeFood = (lstFood) => {
  let res = [];
  lstFood.forEach((item) => {
    const index = res.findIndex(
      (x) =>
        x.movieName === item.movieName &&
        x.roomName === item.roomName &&
        x.type === item.type &&
        x.date === item.date
    );
    if (index !== -1) {
      res[index].quantity += item.quantity;
      res[index].total += item.total;
      res[index].promotion += item.promotion;
    } else {
      res.push(item);
    }
  });
  return res;
};

const getMonthPlus = (value) => {
  const month = parseInt(value, 10);
  if (month === 12) {
    return 1;
  }
  return month + 1;
};

export const getBillByMonth = async (month, year, cinema) => {
  const dateStart = moment(`${month}/1/${year}`, "MM-DD-YYYY").format();
  const dateEnd = moment(
    `${getMonthPlus(month)}/1/${month == 12 ? parseInt(year) + 1 : year}`,
    "MM-DD-YYYY"
  ).format();

  const lstFoodBill = await FoodBill.find({
    createdAt: {
      $gte: dateStart,
      $lte: dateEnd,
    },
    cinema,
  });

  const lstTicketBill = await MovieBill.find({
    createdAt: {
      $gte: dateStart,
      $lte: dateEnd,
    },
    cinema,
  });

  const lstFood = await getListFoodBillDetail(lstFoodBill, true);
  const lstTicket = await getListMovieBillDetail(lstTicketBill, true);

  return {
    data: [
      ...(await mergeTicket(lstFood.data)),
      ...(await mergeFood(lstTicket.data)),
    ],
    total: lstFood.total + lstTicket.total,
    promotion: lstFood.promotion + lstTicket.promotion,
  };
};

export const revenueStatisticsMovie = async (
  cinema,
  _dateStart,
  _dateEnd,
  movieId
) => {
  const movie = await Movie.findById(movieId);
  if (movie) {
    const dateStart = moment(_dateStart, "MM-DD-YYYY").format();
    const dateEnd = moment(_dateEnd, "MM-DD-YYYY").format();

    console.log(dateStart, dateEnd);

    const lstFoodBill = await FoodBill.find({
      createdAt: {
        $gte: dateStart,
        $lte: dateEnd,
      },
      cinema,
      movieName: movie.name,
    });

    const lstTicketBill = await MovieBill.find({
      createdAt: {
        $gte: dateStart,
        $lte: dateEnd,
      },
      cinema,
      movieName: movie.name,
    });

    const lstFood = await getListFoodBillDetail(lstFoodBill, true);
    const lstTicket = await getListMovieBillDetail(lstTicketBill, true);
    return {
      movie: movie.name,
      totalFood: lstFood.total,
      totalTicket: lstTicket.total,
      totalPrice: lstFood.total + lstTicket.total,
      totalPromotion: lstFood.promotion + lstTicket.promotion,
    };
  }
  return {
    movie: movieId,
    totalFood: 0,
    totalTicket: 0,
    totalPrice: 0,
    totalPromotion: 0,
  };
};

export const isDeleteRoom = async (roomId) => {
  const lstShoTimes = await ShowTimeDetail.find({ room: roomId });
  if (lstShoTimes) {
    return true;
  }
  return false;
};

export const isDeleteMovie = async (cinemaId) => {
  const lstShoTimes = await ShowTime.find({ cinema: cinemaId });
  if (lstShoTimes) {
    return true;
  }
  return false;
};

export const isCheckPointUser = async (userId) => {
  const user = await User.findById(userId);
  if (user && user.point > 0) {
    return true;
  }
  return false;
};
