import { Schema, model } from "mongoose";

const languageSchema = new Schema({
  name: String,
});
module.exports = model("languages", languageSchema);
