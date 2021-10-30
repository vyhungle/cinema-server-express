import { model, Schema } from "mongoose";

const foodBillSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  total: Number,
  createdAt: String,
  paymentType: Number,
});

module.exports = model("foodbills", foodBillSchema);
