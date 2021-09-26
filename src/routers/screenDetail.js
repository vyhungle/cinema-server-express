import express from "express";
const router = express.Router();
import request from "supertest";
import { addPremiere } from "../api/serverAPI";

import ScreenDetail from "../models/ScreenDetail";

router.post("/add", async (req, res) => {
  const { screenId, movieId } = req.body;
  const client = request(req.app);

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

      addPremiere(client, "/api/premiere/add", movieId, screenDetail._id);

      const newScreenDetail = await ScreenDetail.findById(screenDetail._id)
        .populate("movie")
        .populate("screen");
      return res.json({
        success: true,
        message: "Thêm định dạng phim thành công",
        values: {
          screenDetail: newScreenDetail,
        },
      });
    }
    return res.json({
      success: false,
      message: "Đã tồn tại định dạng màng hình này rồi",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Lỗi 400!",
      errors: error.message,
    });
  }
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
        message: "sửa dạng phim thành công",
        values: {
          screenDetail: newScreenDetail,
        },
      });
    }
    return res.json({
      success: false,
      message: "Đã tồn tại định dạng màng hình này rồi",
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
    const screenDetail = await ScreenDetail.find()
      .populate("screen")
      .populate("movie");
    if (screenDetail) {
      return res.json({
        success: true,
        message: "Lấy danh sách định dạng màng hình thành công",
        values: {
          screenDetail,
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

router.get("/find-screen/:id", async (req, res) => {
  try {
    const screenDetails = await ScreenDetail.find({ screen: req.params.id })
      .populate("screen")
      .populate("movie");
    if (screenDetails) {
      return res.json({
        success: true,
        message:
          "Lấy danh sách định dạng màng hình theo loại màng hình thành công",
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

router.get("/find-movie/:id", async (req, res) => {
  try {
    const screenDetails = await ScreenDetail.find({ movie: req.params.id })
      .populate("screen")
      .populate("movie");
    if (screenDetails) {
      return res.json({
        success: true,
        message:
          "Lấy danh sách định dạng màng hình theo loại màng hình thành công",
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
