import express from "express";
const router = express.Router();
import request from "supertest";

import Movie from "../models/Movie";
import { addScreenDetail } from "../api/serverAPI";
import { ValidateMovie } from "../utils/validators";

router.post("/add", async (req, res) => {
  const client = request(req.app);
  const {
    name,
    moveDuration,
    image,
    trailer,
    description,
    director,
    cast,
    screensId,
  } = req.body;

  try {
    const { valid, errors } = ValidateMovie(
      name,
      moveDuration,
      image,
      trailer,
      director,
      cast
    );
    if (valid) {
      const movie = new Movie({
        name,
        moveDuration,
        image,
        trailer,
        description,
        director,
        cast,
      });
      await movie.save();
      // thêm định dạnh phim
      // addScreenDetail(client, screensId, "/api/screenDetail/add", movie._id);
      return res.json({
        success: true,
        message: "Thêm phim thành công",
        values: {
          movie,
        },
      });
    }

    return req.json({
      success: false,
      message: "Tạo phim thất bại",
      errors,
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
    const movies = await Movie.find();
    if (movies) {
      return res.json({
        success: true,
        message: "Lấy danh sách thể lo phim thành công",
        values: { movies },
      });
    }
    Pp;
    return res.json({
      success: false,
      message: "Lấy danh sách phim thất bại",
      values: { movies: [] },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Lỗi 400!",
      errors: error.message,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (movie) {
      return res.json({
        success: true,
        message: "Lấy phim thành công",
        values: { movie },
      });
    }
    return res.json({
      success: false,
      message: "Lấy phim thất bại",
      values: { movie: {} },
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
