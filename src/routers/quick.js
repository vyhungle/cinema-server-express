import express from "express";
const router = express.Router();
import Cinema from "../models/Cinema";
import ShowTime from "../models/ShowTime";
import { errorCatch } from "../utils/constaints";

router.get("/cinema-by-movie/:id", async (req, res) => {
  try {
    const movie = req.params.id;
    const showTimes = await ShowTime.find({ movie }).populate("cinema");
    const cinemas = [];
    showTimes.forEach((item) => {
      const index = cinemas.findIndex((x) => x._id === item.cinema._id);
      if (index === -1) {
        cinemas.push(item.cinema);
      }
    });
    return res.json({
      success: true,
      message: "Lấy danh sách rạp thành công",
      values: {
        cinemas,
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

module.exports = router;
