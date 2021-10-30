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
  quantity: Number,
  price: Number,
});

module.exports = model("fooddetails", foodDetailSchema);
