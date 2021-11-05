import express from "express";
const router = express.Router();

import verifyTokenUser from "../middleware/auth";
import MovieBill from "../models/MovieBill";
import FoodBill from "../models/FoodBill";
import FoodDetail from "../models/FoodDetail";
import MovieBillDetail from "../models/MovieBillDetail";
import { mergeFoodBill, mergeMovieBill } from "../utils/service";
import { errorCatch } from "../utils/constaints";
import { sortBill } from "../utils/helper";
import verifyToken from "../middleware/custom";

router.get("/get-all-bill/", verifyTokenUser, async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    let countSize = 0;
    await MovieBill.countDocuments({ user: req.userId }, function (err, count) {
      countSize += count;
    });
    await FoodBill.countDocuments({ user: req.userId }, function (err, count) {
      countSize += count;
    });

    const avgLimit = limit / 2;
    let mBill = await MovieBill.find({ user: req.userId })
      .sort({ createdAt: -1 })
      .limit(parseInt(avgLimit, 10))
      .skip((parseInt(page, 10) - 1) * parseInt(avgLimit, 10))
      .exec();

    const limitFood =
      mBill.length < limit / 2 ? avgLimit + avgLimit - mBill.length : avgLimit;

    let fBill = await FoodBill.find({ user: req.userId })
      .sort({ createdAt: -1 })
      .limit(parseInt(limitFood, 10))
      .skip((parseInt(page, 10) - 1) * parseInt(limitFood, 10))
      .exec();
    
    const mergeMBill = await mergeMovieBill(mBill);
    const mergeFBill = await mergeFoodBill(fBill);
    const bills = mergeFBill.concat(mergeMBill);

    return res.json({
      success: true,
      message: "Lấy hóa đơn theo user thành công",
      values: {
        page,
        pageSize: Math.ceil(countSize / limit),
        hasMore: countSize > limit * parseInt(page, 10),
        bills: bills.sort(
          (a, b) => new Date(b.bill.createdAt) - new Date(a.bill.createdAt)
        ),
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
