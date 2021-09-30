import express from "express";
const router = express.Router();
import Ticker from "../models/Ticker";

router.post("/add", async (req, res) => {
  const { rowNumber, seatInRow, price, premiere } = req.body;
  try {
    const number = seatInRow * rowNumber;

    for (let i = 1; i <= number; i++) {
      const ticker = new Ticker({
        seatName: i,
        price: price,
        status: false,
        premiere,
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

module.exports = router;
