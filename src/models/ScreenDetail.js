import { Schema, model } from "mongoose";

const screenDetailSchema = new Schema({
  screen: {
    type: Schema.Types.ObjectId,
    ref: "screens",
  },
  movie: {
    type: Schema.Types.ObjectId,
    ref: "movies",
  },
});
module.exports = model("screenDetails", screenDetailSchema);
