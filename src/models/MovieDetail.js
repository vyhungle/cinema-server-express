import { model, Schema } from "mongoose";

const movieDetailSchema = new Schema({
  dateStart: String,
  dateEnd: String,
  cinema: {
    type: Schema.Types.ObjectId,
    ref: "cinemas",
  },
  movie: {
    type: Schema.Types.ObjectId,
    ref: "movies",
  },
});

module.exports = model("moviedetails", movieDetailSchema);
