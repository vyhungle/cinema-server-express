import express from "express";
const router = express.Router();
import Movie from "../models/Movie";

router.post("/add", async (req, res) => {
  const { name, moveDuration, image, trailer, description, nation, cast } =
    req.body;

  try {
    const movie = new Movie({
      name,
      moveDuration,
      image,
      trailer,
      description,
      nation,
      cast,
    });
    await movie.save();
    return res.json({
      success: true,
      message: "Thêm phim thành công",
      values: {
        movie,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi server!",
      error: error.message,
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
    return res.status(400).json({
      success: false,
      message: "Lấy danh sách phim thất bại",
      values: { movies: [] },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi server!",
      error: error.message,
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
    return res.status(400).json({
      success: false,
      message: "Lấy phim thất bại",
      values: { movie: {} },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi server!",
      error: error.message,
    });
  }
});

module.exports = router;
