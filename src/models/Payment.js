import { model, Schema } from "mongoose";

const paymentSchema = new Schema({
  username: String,
  password: String,
  money: Number,
});

module.exports = model("payments", paymentSchema);
