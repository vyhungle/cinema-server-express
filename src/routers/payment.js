import express from "express";
const router = express.Router();
import Payment from "../models/Payment";
import PaymentBill from "../models/PaymentBill";
import User from "../models/User";
import Staff from "../models/Staff";
import OtpPayment from "../models/OtpPayment";

import MovieBill from "../models/MovieBill";
import { errorCatch } from "../utils/constaints";
import verifyToken from "../middleware/custom";
import { mailOptionOtp, transporter } from "../config/nodeMailer";
import { paymentsData } from "../utils/data";

router.post("/add-order", async (req, res) => {
  const { username, password, billId } = req.body;
  try {
    const payment = await Payment.findOne(username, password);
    if (payment) {
      const bill = await MovieBill.findById(billId);
      if (bill && payment.money >= bill.total) {
        bill.status = 1;
        payment.money -= bill.total;
        const paymentBill = new PaymentBill({
          movieBill: billId,
          total: bill.total,
          createdAt: new Date().toISOString(),
        });
        await paymentBill.save();
        await payment.save();
        await bill.save();
        return res.json({
          success: true,
          message: "Thanh toán thành công",
        });
      } else {
        return res.json({
          success: false,
          message: "Thanh toán thất bại",
        });
      }
    }
    return res.json({
      success: false,
      message: "Thanh toán thất bại",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: errorCatch,
      errors: error.message,
    });
  }
});

router.get("/payment-list", async (req, res) => {
  return res.json({
    success: true,
    message: "Lấy danh sách ngân hàng thành công",
    payments: [
      { type: 1, name: "Ví điện tử momo" },
      { type: 2, name: "Zalo payment" },
    ],
  });
});

router.post("/login", verifyToken, async (req, res) => {
  const { username, password } = req.body;
  try {
    const payment = await Payment.findOne({ username, password });
    if (payment) {
      let user = {};
      if (req.type === 0) {
        user = await User.findById(req.userId);
      } else {
        user = await Staff.findById(req.staffId);
      }
      const email = user.email;
      const paymentName = paymentsData.find((x) => x.type == payment.type);
      const name = user?.profile?.fullName;
      const otp = Math.floor(100000 + Math.random() * 900000);
      const dateNow = new Date().toISOString();
      const newOtp = new OtpPayment({
        user: username,
        dateEX: new Date(dateNow).setDate(new Date(dateNow).getMinutes() + 3),
        otp,
      });
      await newOtp.save();
      transporter.sendMail(
        mailOptionOtp(email, paymentName, name, otp),
        function (error, info) {
          res.json({
            message: error || info,
          });
        }
      );

      return res.json({
        success: true,
        message: "Gửi otp thành công",
      });
    }
    return res.json({
      success: false,
      message: "Thông tin tài khoảng, hoặc mật khẩu không chính sác",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: errorCatch,
      errors: error.message,
    });
  }
});

module.exports = router;
