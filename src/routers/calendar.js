import express from "express";
const router = express.Router();
import { getDaysInMonth } from "../utils/helper";

router.get("/get-date", async (req, res) => {
  const { year, month } = req.body;
  try {
    const calendar = getDaysInMonth(year, month);
    return res.json({
      success: true,
      message: "Lấy khung giờ chiếu thành công",
      values: {
        calendar,
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

module.exports = router;
