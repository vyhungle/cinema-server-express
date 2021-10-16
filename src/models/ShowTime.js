import { model, Schema } from "mongoose";

const showTimeSchema = new Schema({
  status: Boolean,
  cinema: {
    type: Schema.Types.ObjectId,
    ref: "cinemas",
  },
  movie: {
    type: Schema.Types.ObjectId,
    ref: "movies",
  },
});

module.exports = model("showtimes", showTimeSchema);
