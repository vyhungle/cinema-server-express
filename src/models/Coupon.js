import { model, Schema } from "mongoose";

const couponSchema = new Schema({
  code: String,
  Date: String,
  pointTotal: Number,
  dateExpiry: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
});

module.exports = model("coupons", couponSchema);
