import express from "express";
const router = express.Router();
import Ticker from "../models/Ticker";
import ShowTimeDetail from "../models/ShowTimeDetail";
import { checkWeekend, renderStringSeat } from "../utils/helper";

router.post("/add", async (req, res) => {
  const { data, showTimeDetailId } = req.body;
  // seatNames, showTimeDetailId, price, idSeat, status
  try {
    // lấy chi tiết lịch chiếu
    const stDetail = await ShowTimeDetail.findById(showTimeDetailId).populate({
      path: "room",
      populate: { path: "screen" },
    });

    // kiểm tra vé trùng
    let duplicateSeat = [];
    for (let i = 0; i < data.length; i++) {
      const isTicker = await Ticker.findOne({
        seatName: data[i].seatName,
        showTimeDetail: showTimeDetailId,
        idSeat: data[i].idSeat,
      });
      if (isTicker) {
        duplicateSeat.push(data[i].seatName);
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
    data.forEach(async (item) => {
      const priceBefore = checkWeekend(stDetail.date)
        ? stDetail.room.screen.weekendPrice
        : stDetail.room.screen.weekdayPrice;
      const newTicker = new Ticker({
        idSeat: item.idSeat,
        seatName: item.seatName,
        price: item.price || priceBefore,
        status: item.status,
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
      })
      .populate("timeSlot");
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
