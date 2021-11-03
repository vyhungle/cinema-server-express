import express from "express";
const router = express.Router();
import { addPremiere } from "../api/serverAPI";

import CategoryDetail from "../models/CategoryDetail";
import { errorCatch } from "../utils/constaints";

router.post("/add", async (req, res) => {
  const { categoryId, movieId } = req.body;

  try {
    const is = await CategoryDetail.findOne({
      category: categoryId,
      movie: movieId,
    });
    if (is) {
      return res.json({
        success: false,
        message: "Phim đã tồn tạo thể loại này rồi",
      });
    }
    const newCategoryDetail = new CategoryDetail({
      category: categoryId,
      movie: movieId,
    });
    await newCategoryDetail.save();
    return res.json({
      success: true,
      values: {
        categoryDetail: newCategoryDetail,
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
