import { model, Schema } from "mongoose";

const categorySchema = new Schema({
  name: String,
  image: String,
});

module.exports = model("categories", categorySchema);
