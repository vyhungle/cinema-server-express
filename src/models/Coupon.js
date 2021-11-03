import { model, Schema } from "mongoose";

const couponSchema = new Schema({
  code: String,
  createdAt: String,
  pointTotal: Number,
  dateExpiry: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  gift: {
    type: Schema.Types.ObjectId,
    ref: "gifts",
  },
  status: Number,
});

module.exports = model("coupons", couponSchema);
