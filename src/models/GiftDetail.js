import { model, Schema } from "mongoose";

const giftDetailSchema = new Schema({
  quantity: Number,
  coupon: {
    type: Schema.Types.ObjectId,
    ref: "coupons",
  },
  gift: {
    type: Schema.Types.ObjectId,
    ref: "gifts",
  },
});

module.exports = model("giftdetails", giftDetailSchema);
