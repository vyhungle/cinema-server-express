import express from "express";
const router = express.Router();

import ScreenDetail from "../models/ScreenDetail";

router.post("/add", async (req, res) => {
  const { screenId, movieId } = req.body;
  try {
    const isScreenDetail = await ScreenDetail.findOne({
      screen: screenId,
      movie: movieId,
    });
    if (!isScreenDetail) {
      const screenDetail = new ScreenDetail({
        screen: screenId,
        movie: movieId,
      });
      await screenDetail.save();

      return res.json({
        success: true,
        message: "Thêm chi tiết màng hình thành công",
        values: {
          screenDetail,
        },
      });
    }
    return res.json({
      success: false,
      message: "Đã tồn tại chi tiết màng hình này rồi",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Lỗi 400!",
      errors: error.message,
    });
  }
});

router.delete("/delete-movie/:id", async (req, res) => {
  try {
    await ScreenDetail.find({ movie: req.params.id }, function (err, docs) {
      docs.remove();
    });
    return true;
  } catch (error) {}
});

router.put("/update/:id", async (req, res) => {
  const { screenId, movieId } = req.body;
  try {
    const oldScreenDetail = await ScreenDetail.findById(req.params.id);
    if (
      screenId == oldScreenDetail.screen &&
      movieId == oldScreenDetail.movie
    ) {
      return res.json({
        success: false,
        message: "Vui lòng chọn loại màng hình mới hoặc phim mới.",
      });
    }
    const isScreenDetail = await ScreenDetail.findOne({
      screen: screenId,
      movie: movieId,
    });
    if (!isScreenDetail) {
      oldScreenDetail.screen = screenId;
      oldScreenDetail.movie = movieId;
      await oldScreenDetail.save();
      const newScreenDetail = await ScreenDetail.findById(oldScreenDetail._id)
        .populate("movie")
        .populate("screen");
      return res.json({
        success: true,
        message: "sửa chi tiết màng hình thành công",
        values: {
          screenDetail: newScreenDetail,
        },
      });
    }
    return res.json({
      success: false,
      message: "Đã tồn tại chi tiết màng hình này rồi",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Lỗi 400!",
      errors: error.message,
    });
  }
});

router.get("/all", async (req, res) => {
  try {
    const screenDetails = await ScreenDetail.find()
      .populate("screen")
      .populate("movie");
    if (screenDetails) {
      return res.json({
        success: true,
        message: "Lấy danh sách chi tiết màng hình thành công",
        values: {
          screenDetails,
        },
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Lỗi 400!",
      errors: error.message,
    });
  }
});

module.exports = router;
