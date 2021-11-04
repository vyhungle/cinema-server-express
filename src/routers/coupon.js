import express, { json } from "express";
const router = express.Router();
import Gift from "../models/Gift";
import User from "../models/User";
import verifyToken from "../middleware/custom";
import {
  errorCatch,
  responseModal,
  responseModalError,
} from "../utils/constaints";
import { filterGiftByScreen } from "../utils/helper";
import { createCoupon, getCoupon } from "../utils/service";

//#region Gift
router.post("/gift/add", async (req, res) => {
  const {
    name,
    image,
    point,
    type = 0,
    screenId,
    foodId,
    discount,
  } = req.body;
  try {
    const gift = new Gift({
      name,
      image,
      point,
      type,
      screenId, // field cho vé
      foodId, // field cho bắp nước
      discount, // field cho phiếu giảm giá
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
    return res.json(
      responseModalError(false, errorCatch, { errors: error.message })
    );
  }
});
//#endregion

//#region Coupon
router.post("/create-coupon", verifyToken, async (req, res) => {
  const { giftId, userId } = req.body;
  const { typeUser, id, type } = req;
  try {
    const _id = typeUser === 0 ? id : userId;
    return res.json(await createCoupon(_id, giftId));
  } catch (error) {
    return res.json(
      responseModalError(false, errorCatch, { errors: error.message })
    );
  }
});

router.get("/get-gift", verifyToken, async (req, res) => {
  const { code, userId } = req.query;
  const { typeUser, id, type } = req;
  const _id = typeUser === 0 ? id : userId;
  try {
    const couponRes = await getCoupon(code, _id);
    return res.json({
      success: couponRes.success,
      message: couponRes.success
        ? "Lấy coupon thành công"
        : "Không tìm thấy mã coupon này.",
      values: {
        coupon: couponRes.coupon,
      },
    });
  } catch (error) {
    return res.json(
      responseModalError(false, errorCatch, { errors: error.message })
    );
  }
});

//#endregion
module.exports = router;
