import { model, Schema } from "mongoose";

const foodDetailSchema = new Schema({
  food: {
    type: Schema.Types.ObjectId,
    ref: "foods",
  },
  foodBill: {
    type: Schema.Types.ObjectId,
    ref: "foodbills",
  },
  quantity: { type: Number, default: 0 },
  price: { type: Number, default: 0 },
  promotion: { type: Number, default: 0 },
  priceSell: { type: Number, default: 0 },
});

module.exports = model("fooddetails", foodDetailSchema);
