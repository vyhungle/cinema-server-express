import express from "express";
const router = express.Router();
import request from "supertest";
import { addPremiere } from "../api/serverAPI";

import Premiere from "../models/Premiere";

router.post("/add", async (req, res) => {
  const { screenId, movieId } = req.body;
  try {
    const isPremiere = await Premiere.findOne({
      screen: screenId,
      movie: movieId,
    });
    if (!isPremiere) {
      const premiere = new Premiere({
        screen: screenId,
        movie: movieId,
      });
      await premiere.save();

      return res.json({
        success: true,
        message: "Thêm xuất chiếu thành công",
        values: {
          premiere,
        },
      });
    }
    return res.json({
      success: false,
      message: "Đã tồn tại xuất chiếu này rồi",
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
    const oldPremiere = await Premiere.findById(req.params.id);
    if (screenId == oldPremiere.screen && movieId == oldPremiere.movie) {
      return res.json({
        success: false,
        message: "Vui lòng chọn loại màng hình mới hoặc phim mới.",
      });
    }
    const isPremiere = await Premiere.findOne({
      screen: screenId,
      movie: movieId,
    });
    if (!isPremiere) {
      oldPremiere.screen = screenId;
      oldPremiere.movie = movieId;
      await oldPremiere.save();
      const newPremiere = await Premiere.findById(oldPremiere._id)
        .populate("movie")
        .populate("screen");
      return res.json({
        success: true,
        message: "sửa xuất chiếu thành công",
        values: {
          premiere: newPremiere,
        },
      });
    }
    return res.json({
      success: false,
      message: "Đã tồn tại xuất chiếu này rồi",
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
    const premieres = await Premiere.find()
      .populate("screen")
      .populate("movie");
    if (premieres) {
      return res.json({
        success: true,
        message: "Lấy danh sách xuất chiếu thành công",
        values: {
          premieres,
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
    const premiere = await Premiere.find({ screen: req.params.id })
      .populate("screen")
      .populate("movie");
    if (premiere) {
      const movies = [];
      premiere.map((item) => {
        movies.push(item.movie);
      });
      return res.json({
        success: true,
        message: "Lấy danh sách phim theo loại màng hình thành công",
        values: {
          movies,
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
    const premiere = await Premiere.find({ movie: req.params.id })
      .populate("screen")
      .populate("movie");
    if (premiere) {
      return res.json({
        success: true,
        message: "Lấy danh sách xuất chiếu theo loại màng hình thành công",
        values: {
          premiere,
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
