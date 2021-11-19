import express from "express";
const router = express.Router();

import Food from "../models/Food";
import { errorCatch } from "../utils/constaints";
import { ValidateFood } from "../utils/validators";

router.post("/add", async (req, res) => {
  try {
    const { name, price, image, unit } = req.body;
    const { valid, errors } = ValidateFood(name, price, image, unit);
    if (valid) {
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
    }
    return res.json({
      success: false,
      message: "Thêm thất bại",
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

router.put("/update/:id", async (req, res) => {
  try {
    const { name, price, image, unit } = req.body;
    const { valid, errors } = ValidateFood(name, price, image, unit);
    if (valid) {
      const food = await Food.findById(req.params.id);
      food.name = name;
      food.price = price;
      food.image = image;
      food.unit = unit;
      await food.save();
      return res.json({
        success: true,
        message: "Sửa combo thành công.",
        combo: food,
      });
    } else {
      return res.json({
        success: false,
        message: "Sửa thất bại",
        errors,
      });
    }
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
    const food = await Food.findById(req.params.id).deleteOne().exec();
    if (food) {
      return res.json({
        success: true,
        message: "Xóa thành công.",
      });
    }
    return res.json({
      success: false,
      message: "Xóa thất bại.",
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
