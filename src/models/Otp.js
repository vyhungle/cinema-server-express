import { model, Schema } from "mongoose";

const otpSchema = new Schema({
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  code: String,
});

module.exports = model("otp", otpSchema);
