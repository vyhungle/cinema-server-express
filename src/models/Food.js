import { model, Schema } from "mongoose";

const foodSchema = new Schema({
  name: String,
  unit: String,
  image: String,
  price: Number,
});

module.exports = model("foods", foodSchema);
