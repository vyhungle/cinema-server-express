import express from "express";
import moment from "moment";
const router = express.Router();
import Cinema from "../models/Cinema";
import ShowTime from "../models/ShowTime";
import ShowTimeDetail from "../models/ShowTimeDetail";

import { errorCatch } from "../utils/constaints";
import { getDateNow } from "../utils/helper";

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

router.get("/get-date-by-cinema-movie", async (req, res) => {
  try {
    const { cinemaId, movieId } = req.query;
    const showTimes = await ShowTime.find({ cinema: cinemaId, movie: movieId });
    const dates = [];
    const dateNow = getDateNow();
    for (let i = 0; i < showTimes.length; i++) {
      const showTimeDetails = await ShowTimeDetail.find({
        showTime: showTimes[i]._id,
      });
      showTimeDetails.forEach((item) => {
        if (new Date(dateNow).valueOf() <= new Date(item.date).valueOf()) {
          const index = dates.findIndex((x) => x === item.date);
          if (index === -1) {
            dates.push(item.date);
          }
        }
      });
    }

    return res.json({
      success: true,
      message: "Lấy danh sách ngày thành công",
      values: { dates },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: errorCatch,
      errors: error.message,
    });
  }
});

router.get("/get-show-time-detail-by-cinema-movie-date", async (req, res) => {
  try {
    const { date, cinemaId, movieId } = req.query;
    const showTimes = await ShowTime.find({ cinema: cinemaId, movie: movieId });

    let showTimeDetails = [];
    for (let i = 0; i < showTimes.length; i++) {
      const std = await ShowTimeDetail.find({
        showTime: showTimes[i]._id,
        date,
      })
        .populate({ path: "room", populate: "screen" })
        .populate("timeSlot");
      showTimeDetails = [...showTimeDetails, ...std];
    }

    return res.json({
      success: true,
      message: "Lấy danh sách xuất chiếu thành công",
      values: {
        showTimeDetails,
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

router.get("/get-cinema-by-date", async (req, res) => {
  try {
    const { date } = req.query;
    const showTimeDetails = await ShowTimeDetail.find({ date }).populate({
      path: "showTime",
      populate: "cinema",
    });
    const cinemas = [];
    showTimeDetails.forEach((item) => {
      const some = cinemas.some((x) => x._id === item.showTime.cinema._id);
      if (!some) {
        cinemas.push(item.showTime.cinema);
      }
    });
    return res.json({
      success: true,
      message: "lấy danh sách rạp thành công",
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

router.get("/get-movie-by-cinema-date", async (req, res) => {
  try {
    const { cinemaId, date } = req.query;
    const showTimeDetails = await ShowTimeDetail.find({ date }).populate({
      path: "showTime",
      populate: ["cinema", "movie"],
    });
    const movies = [];
    showTimeDetails.forEach((item) => {
      const some = movies.some((x) => x._id === item.showTime.movie._id);
      if (!some) {
        if (item.showTime.cinema._id == cinemaId) {
          movies.push(item.showTime.movie);
        }
      }
    });

    return res.json({
      success: true,
      message: "Lấy danh sách phim thành công",
      values: {
        movies,
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

router.get("/get-movie-by-cinema", async (req, res) => {
  try {
    const { cinemaId } = req.query;
    const now = new Date();
    // const date = `${now.getDay()}/${now.getMonth() + 1}/${now.getFullYear()}`;
    const showTimeDetails = await ShowTimeDetail.find().populate({
      path: "showTime",
      populate: ["cinema", "movie"],
    });
    const movies = [];
    showTimeDetails.forEach((item) => {
      const some = movies.some((x) => x._id === item.showTime.movie._id);
      if (!some) {
        if (item.showTime.cinema._id == cinemaId) {
          movies.push(item.showTime.movie);
        }
      }
    });

    return res.json({
      success: true,
      message: "Lấy danh sách phim thành công",
      values: {
        movies,
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
