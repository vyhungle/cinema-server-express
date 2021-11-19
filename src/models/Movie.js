import { Schema, model } from "mongoose";

const movieSchema = new Schema({
  name: String,
  moveDuration: Number,
  image: String,
  trailer: String,
  description: String,
  cast: String,
  age: Number,
  director: {
    type: Schema.Types.ObjectId,
    ref: "directors",
  },
  dateStart: String,
  dateEnd: String,
});
module.exports = model("movies", movieSchema);
