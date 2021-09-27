import { Schema, model } from "mongoose";

const movieSchema = new Schema({
  name: String,
  moveDuration: Number,
  image: String,
  trailer: String,
  description: String,
  cast: String,
  director: {
    type: Schema.Types.ObjectId,
    ref: "directors",
  },
});
module.exports = model("movies", movieSchema);
