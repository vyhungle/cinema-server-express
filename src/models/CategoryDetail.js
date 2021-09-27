import { Schema, model } from "mongoose";

const categoryDetailSchema = new Schema({
  movie: {
    type: Schema.Types.ObjectId,
    ref: "movies",
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "categories",
  },
});
module.exports = model("categorydetails", categoryDetailSchema);
