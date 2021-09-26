import { Schema, model } from "mongoose";

const screenSchema = new Schema({
  name: String,
  weekdayPrice: Number,
  weekendPrice: Number,
});
module.exports = model("screens", screenSchema);
