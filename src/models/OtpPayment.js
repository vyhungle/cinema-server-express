import { model, Schema } from "mongoose";

const otpPaymentSchema = new Schema({
  user: String,
  otp: String,
  dateEX: String,
  status: {
    type: Boolean,
    default: true,
  },
});

module.exports = model("otppayments", otpPaymentSchema);
