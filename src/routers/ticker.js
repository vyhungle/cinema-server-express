import express from "express";
const router = express.Router();
import Ticker from "../models/Ticker";
import ShowTimeDetail from "../models/ShowTimeDetail";
import { checkWeekend, renderStringSeat } from "../utils/helper";

router.post("/add", async (req, res) => {
  const { seatNames, showTimeDetailId } = req.body;
  try {
    // lấy chi tiết lịch chiếu
    const stDetail = await ShowTimeDetail.findById(showTimeDetailId).populate({
      path: "room",
      populate: { path: "screen" },
    });

    // kiểm tra vé trùng
    let duplicateSeat = [];
    for (let i = 0; i < seatNames.length; i++) {
      const isTicker = await Ticker.findOne({
        seatName: seatNames[i],
        showTimeDetail: showTimeDetailId,
      });
      if (isTicker) {
        duplicateSeat.push(seatNames[i]);
      }
    }
    // nếu có vé trùng return
    if (duplicateSeat.length !== 0) {
      return res.json({
        success: false,
        message: `Đã có người đặt vé cho ghế ${renderStringSeat(
          duplicateSeat
        )} Vui lòng chọn ghế khác.`,
      });
    }

    // tạo vé
    seatNames.forEach(async (item) => {
      const price = checkWeekend(stDetail.date)
        ? stDetail.room.screen.weekendPrice
        : stDetail.room.screen.weekdayPrice;
      const newTicker = new Ticker({
        seatName: item,
        price,
        status: true,
        showTimeDetail: showTimeDetailId,
      });
      await newTicker.save();
    });

    return res.json({
      success: true,
      message: "Đặt vé thành công",
    });
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
      });
    return res.json({
      success: true,
      message: "lấy danh sách vé thành công",
      values: {
        tickets,
        showTimeDetail: stDetail,
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
