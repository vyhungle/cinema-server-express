import express from "express";
const router = express.Router();
import Ticker from "../models/Ticker";

router.post("/add", async (req, res) => {
  const { rowNumber, seatInRow, price, showTime } = req.body;
  try {
    const number = seatInRow * rowNumber;

    for (let i = 1; i <= number; i++) {
      const ticker = new Ticker({
        seatName: i,
        price: price,
        status: false,
        showTime,
      });
      await ticker.save();
    }
    return res.json({
      success: true,
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
    const tickers = await Ticker.find({ showTime: req.params.id });

    return res.json({
      success: true,
      message: "Lấy danh sách vé thành công",
      tickers,
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
