import { Schema, model } from "mongoose";

const nationSchema = new Schema({
  name: String,
});
module.exports = model("nations", nationSchema);
