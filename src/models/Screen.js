import { Schema, model } from "mongoose";

const screenSchema = new Schema({
  name: String,
});
module.exports = model("screens", screenSchema);
