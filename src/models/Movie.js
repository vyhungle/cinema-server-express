import { Schema, model } from "mongoose";

const movieSchema = new Schema({
  name: String,
  moveDuration: String,
  date: {},
});
module.exports = model("movies", movieSchema);
