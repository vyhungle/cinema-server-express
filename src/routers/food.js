import express from "express";
const router = express.Router();

import Food from "../models/Food";
import { errorCatch } from "../utils/constaints";

router.post("/add", async (req, res) => {
  try {
    const { name, price, image, unit } = req.body;
    const food = new Food({
      name,
      price,
      image,
      unit,
    });
    await food.save();
    return res.json({
      success: true,
      message: "Thêm combo thành công.",
      combo: food,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: errorCatch,
      errors: error.message,
    });
  }
});

router.get("/get-all", async (req, res) => {
  try {
    const combos = await Food.find();
    return res.json({
      success: true,
      message: "Lấy danh sách combo thành công",
      combos,
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
