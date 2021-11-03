import express from "express";
const router = express.Router();
import Screen from "../models/Screen";
import { errorCatch } from "../utils/constaints";

router.post("/add", async (req, res) => {
  const { name } = req.body;

  try {
    const screen = new Screen({
      name,
    });
    await screen.save();
    return res.json({
      success: true,
      message: "Thêm thể loại màng hình thành công",
      values: {
        screen,
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

router.get("/all", async (req, res) => {
  try {
    const screens = await Screen.find();
    if (screens) {
      return res.json({
        success: true,
        message: "lấy danh sách màng hình thành công",
        values: {
          screens,
        },
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

module.exports = router;
