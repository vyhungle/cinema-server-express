import express from "express";
const router = express.Router();

import MovieBill from "../models/MovieBill";
import FoodBill from "../models/FoodBill";
import FoodDetail from "../models/FoodDetail";
import MovieBillDetail from "../models/MovieBillDetail";
import { mergeFoodBill, mergeMovieBill } from "../utils/service";

router.get("/get-all-bill/:id", async (req, res) => {
  try {
    const mBill = await MovieBill.find({ user: req.params.id });
    const fBill = await FoodBill.find({ user: req.params.id });
    const mergeMBill = await mergeMovieBill(mBill);
    const mergeFBill = await mergeFoodBill(fBill);
    const bills = mergeFBill.concat(mergeMBill);

    return res.json({
      bills: bills.sort(
        (a, b) => new Date(a.bill.createdAt) - new Date(b.bill.createdAt)
      ),
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Lỗi 400!",
      errors: error.message,
    });
  }
});

module.exports = router;
