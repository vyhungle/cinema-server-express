import express, { json } from "express";
const router = express.Router();
import moment from "moment";

import MovieDetail from "../models/MovieDetail";
import { errorCatch } from "../utils/constaints";
import { ValidateMovieDetail } from "../utils/validators";

router.post("/add", async (req, res) => {
  try {
    const { movieId, cinemaId, dateStart, dateEnd } = req.body;
    const { errors, valid } = ValidateMovieDetail(
      movieId,
      cinemaId,
      dateStart,
      dateEnd
    );

    if (valid) {
      const check = await MovieDetail.findOne({
        movie: movieId,
        cinema: cinemaId,
      });
      if (!check) {
        const newMovieDetail = await MovieDetail({
          movie: movieId,
          cinema: cinemaId,
          dateStart: moment(dateStart).format("L"),
          dateEnd: moment(dateEnd).format("L"),
        });
        await newMovieDetail.save();
        const movieDetail = await MovieDetail.findById(
          newMovieDetail._id
        ).populate("movie");
        return res.json({
          success: true,
          message: "Thêm phim vào rạp thàng công.",
          movieDetail: movieDetail,
        });
      }
      return res.json({
        success: false,
        message: "Rạp đã tồn tại phim này rồi.",
        errors: {
          cinema: "Rạp đã tồn tại phim này rồi.",
        },
      });
    }
    return res.json({
      success: false,
      message: "Thêm phim vào rạp thất bại",
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
  try {
    const { movieId, cinemaId, dateStart, dateEnd } = req.body;
    const { errors, valid } = ValidateMovieDetail(
      movieId,
      cinemaId,
      dateStart,
      dateEnd
    );

    if (valid) {
      const oldMovieDetail = await MovieDetail.findById(req.params.id);

      if (
        oldMovieDetail.movie != movieId ||
        oldMovieDetail.cinema != cinemaId
      ) {
        const check = await MovieDetail.findOne({
          movie: movieId,
          cinema: cinemaId,
        });
        if (!check) {
          oldMovieDetail.movie = movieId;
          oldMovieDetail.cinema = cinemaId;
          oldMovieDetail.dateStart = moment(dateStart).format("L");
          oldMovieDetail.dateEnd = moment(dateEnd).format("L");
          await oldMovieDetail.save();

          const movieDetail = await MovieDetail.findById(
            req.params.id
          ).populate("movie");
          return res.json({
            success: true,
            message: "Sửa phim thàng công.",
            movieDetail,
          });
        }
        return res.json({
          success: false,
          message: "Rạp đã tồn tại phim này rồi.",
          errors: {
            cinema: "Rạp đã tồn tại phim này rồi.",
          },
        });
      } else {
        oldMovieDetail.movie = movieId;
        oldMovieDetail.cinema = cinemaId;
        oldMovieDetail.dateStart = moment(dateStart).format("L");
        oldMovieDetail.dateEnd = moment(dateEnd).format("L");
        await oldMovieDetail.save();

        const movieDetail = await MovieDetail.findById(req.params.id).populate(
          "movie"
        );
        return res.json({
          success: true,
          message: "Sửa phim thàng công.",
          movieDetail,
        });
      }
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

router.get("/get-movie-in-cinema/:id", async (req, res) => {
  try {
    const movieDetail = await MovieDetail.find({
      cinema: req.params.id,
    }).populate("movie");

    if (movieDetail) {
      let movies = [];
      movieDetail.map((item) => {
        movies.push(item.movie);
      });
      return res.json({
        success: true,
        message: "Lấy danh sách phim tại rạp thành công",
        movies,
      });
    }
    return res.json({
      success: false,
      message: "Lấy danh sách phim tại rạp thất bại",
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
