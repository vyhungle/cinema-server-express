import Payment from "../models/Payment";
import MovieBillDetail from "../models/MovieBillDetail";
import FoodDetail from "../models/FoodDetail";

export const isPayment = async (username, password, total) => {
  const payment = await Payment.findOne({ username, password });
  if (payment) {
    if (total && payment.money >= total) {
      payment.money -= total;
      await payment.save();
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
    }).populate("ticket");

    if (!res.some((x) => x.bill._id === values[i]._id)) {
      res.push({
        bill: values[i],
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
    res = [...res, item.food];
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
