import express from "express";
const router = express.Router();
import Payment from "../models/Payment";
import PaymentBill from "../models/PaymentBill";

import MovieBill from "../models/MovieBill";
import { errorCatch } from "../utils/constaints";

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

module.exports = router;
