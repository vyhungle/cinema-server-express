import express from "express";
const router = express.Router();
import ShowTimeDetail from "../models/ShowTimeDetail.js";
import haversine from "haversine";

router.get("/test", async (req, res) => {
  try {
    const start = {
      latitude: 12.721332807604266,
      longitude: 108.23833814598193,
    };

    // 12.721332807604266, 108.23833814598193
    // 10.806698885168837, 106.62894702634684

    const end = {
      latitude: 10.823126287256677,
      longitude: 106.6453205934414,
    };
    // 10.823126287256677, 106.6453205934414
    // 10.768521579380778, 10.823126287256677
    res.json({
      km: haversine(start, end, { unit: "km" }),
      meter: haversine(start, end, { unit: "meter" }),
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: errorCatch,
      errors: error.message,
    });
  }
});

module.exports = router;
