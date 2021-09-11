import express from "express";
import Otp from "../models/Otp";
import { formatCode } from "../utils/format";
import { sendMessage } from "../utils/tiwilio";
const router = express.Router();

// @route POST api/auth/user
// @desc get my user
// @access Private

router.post("/send", async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    const code = formatCode(Math.floor(Math.random() * 10000) + "");
    const otp = await Otp.findOne({ phoneNumber });
    if (otp) {
      otp.code = code;
      await otp.save();
    } else {
      const newOtp = new Otp({
        phoneNumber,
        code,
      });
      newOtp.save();
    }
    res.json({
      success: true,
      message: "Gửi otp thành công",
      values: {
        code,
      },
    });
    sendMessage(code, phoneNumber);
    
  } catch (error) {
    return res.json({
      success: false,
      message: "Gửi OTP thất bại",
      error,
    });
  }
});

module.exports = router;
