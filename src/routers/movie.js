import express from "express";
const router = express.Router();
import Movie from "../models/Movie";

router.post("/add", async (req, res) => {
  const { name, image } = req.body;

  try {
    const category = new Category({
      name,
      image,
    });
    await category.save();
    return res.json({
      success: true,
      message: "Thêm thể loại thành công",
      values: {
        category,
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

module.exports = router;
