import express, { json } from "express";
const router = express.Router();
import Gift from "../models/Gift";
import {
  errorCatch,
  responseModal,
  responseModalError,
} from "../utils/constaints";
import { filterGiftByScreen } from "../utils/helper";

//#region Gift
router.post("/gift/add", async (req, res) => {
  const { name, image, point, type = 0 } = req.body;
  try {
    const gift = new Gift({
      name,
      image,
      point,
      type,
    });
    await gift.save();
    return res.json({
      success: true,
      message: "Thêm quà thành công.",
      values: {
        gift,
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

router.get("/gift/get-all", async (req, res) => {
  try {
    const { screenId } = req.query;
    const listGift = await Gift.find();
    return res.json(
      responseModal(true, "Lấy danh sách quà thành công", {
        gifts: filterGiftByScreen(listGift, screenId),
      })
    );
  } catch (error) {
    return res.json(responseModalError(false, errorCatch, error.message));
  }
});
//#endregion
module.exports = router;
