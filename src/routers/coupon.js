import express from "express";
const router = express.Router();
import Gift from "../models/Gift";
import { errorCatch } from "../utils/constaints";

//#region Gift
router.post("/gift/add", async (req, res) => {
  const { name, image, point } = req.body;
  try {
    const gift = new Gift({
      name,
      image,
      point,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: errorCatch,
      errors: error.message,
    });
  }
});
//#endregion
module.exports = router;
