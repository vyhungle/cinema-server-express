import { Schema, model } from "mongoose";

const movieSchema = new Schema({
  name: String,
  moveDuration: String,
  image: String,
  trailer: String,
  description: String,
  nation: {
    type: Schema.Types.ObjectId,
    ref: "nations",
  },
  cast:{
    type: Schema.Types.ObjectId,
    ref: "casts",
  }
});
module.exports = model("movies", movieSchema);
