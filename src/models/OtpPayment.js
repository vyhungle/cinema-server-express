import { model, Schema } from "mongoose";

const otpPaymentSchema = new Schema({
  user: String,
  otp: String,
  dateEX: String,
});

module.exports = model("otppayments", otpPaymentSchema);
