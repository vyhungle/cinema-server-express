import express from "express";
const router = express.Router();
import Payment from "../models/Payment";

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
