import { model, Schema } from "mongoose";

const paymentSchema = new Schema({
  username: String,
  password: String,
  money: Number,
  type: {
    type: Number,
    default: 0,
  },
});

module.exports = model("payments", paymentSchema);
