import express from "express";
const router = express.Router();
import ShowTimeDetail from "../models/ShowTimeDetail.js";

router.get("/test", async (req, res) => {
  try {
    await ShowTimeDetail.find().exec((error, docs) => {
      if (docs) {
        return res.json(docs.filter((x) => x.date === "10/18/2021"));
      }
      return res.status(400).json({
        success: false,
        message: errorCatch,
        errors: error.message,
      });
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
