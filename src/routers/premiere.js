import express from "express";
const router = express.Router();
import Premiere from "../models/Premiere";

router.post("/add", async (req, res) => {
  const { movieId, screenDetailId } = req.body;
  const is = await Premiere.findOne({
    movie: movieId,
    screenDetail: screenDetailId,
  });

  if (is) {
    return res.json({
      success: false,
      message: "Đã tồn tại xuất chiếu này rồi",
    });
  }
  const premiere = new Premiere({
    movie: movieId,
    screenDetail: screenDetailId,
  });
  await premiere.save();
  return res.json({
    success: true,
    message: "Tạo xuất chiếu thành công",
    values: {
      premiere,
    },
  });
  try {
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Lỗi 400!",
      errors: error.message,
    });
  }
});

module.exports = router;
