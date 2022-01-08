import express from "express";
const router = express.Router();
import request from "supertest";

import Movie from "../models/Movie";
import MovieDetail from "../models/MovieDetail";
import CategoryDetail from "../models/CategoryDetail";
import ScreenDetail from "../models/ScreenDetail";

import { addCategoryDetail, addSCreenDetail } from "../api/serverAPI";
import { ValidateMovie } from "../utils/validators";
import { errorCatch } from "../utils/constaints";
import { getMoviePlay, getMoviePlayCMS } from "../utils/service";

router.post("/add", async (req, res) => {
  const client = request(req.app);
  const {
    name,
    moveDuration,
    image,
    trailer,
    description,
    directorId,
    cast,
    screensId,
    categoryId,
    age,
    dateStart,
    dateEnd,
  } = req.body;

  try {
    const { valid, errors } = ValidateMovie(
      name,
      moveDuration,
      image,
      trailer,
      directorId,
      cast,
      age,
      dateStart,
      dateEnd
    );
    if (valid) {
      const movie = new Movie({
        name,
        moveDuration,
        image,
        trailer,
        description,
        director: directorId,
        cast,
        age,
        dateStart,
        dateEnd,
      });
      await movie.save();
      // thêm xuất chiếu phim
      addSCreenDetail(client, screensId, "/api/screenDetail/add", movie._id);
      // thêm thể loại
      addCategoryDetail(
        client,
        categoryId,
        "/api/categoryDetail/add",
        movie._id
      );

      return res.json({
        success: true,
        message: "Thêm phim thành công",
        values: {
          movie,
        },
      });
    }

    return res.json({
      success: false,
      message: "Tạo phim thất bại",
      errors,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: errorCatch,
      errors: error.message,
    });
  }
});

router.put("/update/:id", async (req, res) => {
  const client = request(req.app);
  const {
    name,
    moveDuration,
    image,
    trailer,
    description,
    directorId,
    cast,
    screensId,
    categoryId,
    age,
    dateStart,
    dateEnd,
  } = req.body;

  try {
    const movie = await Movie.findById(req.params.id);
    const { valid, errors } = ValidateMovie(
      name,
      moveDuration,
      image,
      trailer,
      directorId,
      cast,
      age,
      dateStart,
      dateEnd,
      true
    );
    if (valid) {
      movie.name = name;
      movie.moveDuration = moveDuration;
      movie.image = image;
      movie.trailer = trailer;
      movie.description = description;
      movie.directorId = directorId;
      movie.cast = cast;
      movie.age = age;
      movie.dateStart = dateStart;
      movie.dateEnd = dateEnd;
      await movie.save();

      // delete screen detail
      await ScreenDetail.find({ movie: req.params.id }).deleteMany().exec();
      // delete category detail
      await CategoryDetail.find({ movie: req.params.id }).deleteMany().exec();

      // thêm màng hình
      addSCreenDetail(client, screensId, "/api/screenDetail/add", movie._id);
      // thêm thể loại
      addCategoryDetail(
        client,
        categoryId,
        "/api/categoryDetail/add",
        movie._id
      );

      return res.json({
        success: true,
        message: "Sửa phim thành công",
        values: {
          movie,
        },
      });
    }

    return res.json({
      success: false,
      message: "Sửa phim thất bại",
      errors,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: errorCatch,
      errors: error.message,
    });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const check = await MovieDetail.find({ movie: req.params.id });
    if (check.length === 0) {
      const movie = await Movie.findById(req.params.id).deleteOne().exec();
      if (movie) {
        // delete screen detail
        await ScreenDetail.find({ movie: req.params.id }).deleteMany().exec();
        // delete category detail
        await CategoryDetail.find({ movie: req.params.id }).deleteMany().exec();

        return res.json({
          success: true,
          message: "Xóa phim thành công",
        });
      }
      return res.status(404).json({
        success: false,
        message: "xóa phim thất bại",
      });
    }
    return res.json({
      success: false,
      message: "Hiện tại có rạp đang chiếu, nên không thể xóa phim này.",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: errorCatch,
      errors: error.message,
    });
  }
});

const getMovie = async (movie) => {
  const categoryDetail = await CategoryDetail.find({
    movie: movie.id,
  }).populate("category");
  const screenDetail = await ScreenDetail.find({
    movie: movie.id,
  }).populate("screen");

  const categories = [];
  for (let item of categoryDetail) {
    categories.push(item.category);
  }

  const screens = [];
  for (let item of screenDetail) {
    screens.push(item.screen);
  }
  return { ...movie._doc, categories, screens };
};

router.get("/all", async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    let countSize = 0;
    Movie.count({}, function (err, count) {
      countSize = count;
    });

    const movies = await Movie.find()
      .populate("director")
      .limit(parseInt(limit, 10))
      .skip((parseInt(page, 10) - 1) * parseInt(limit, 10));

    if (movies) {
      for (let i = 0; i < movies.length; i++) {
        movies[i] = await getMovie(movies[i]);
      }
      return res.json({
        success: true,
        message: "Lấy danh sách thể loai phim thành công",
        values: {
          pageNumber: countSize / parseInt(limit, 10),
          hasMore: countSize > parseInt(limit, 10) * parseInt(page, 10),
          movies,
        },
      });
    }
    return res.json({
      success: false,
      message: "Lấy danh sách phim thất bại",
      values: { movies: [] },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: errorCatch,
      errors: error.message,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id).populate("director");
    if (movie) {
      return res.json({
        success: true,
        message: "Lấy phim thành công",
        values: {
          movie: await getMovie(movie),
        },
      });
    }
    return res.json({
      success: false,
      message: "Lấy phim thất bại",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: errorCatch,
      errors: error.message,
    });
  }
});

router.get("/get/movie-play", async (req, res) => {
  try {
    const movie = await getMoviePlay();
    return res.json({
      success: true,
      message: "Lấy danh sách phim thành công",
      values: movie,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: errorCatch,
      errors: error.message,
    });
  }
});

router.get("/get/movie-play-cms", async (req, res) => {
  try {
    const movie = await getMoviePlayCMS();
    return res.json({
      success: true,
      message: "Lấy danh sách phim thành công",
      values: movie,
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
