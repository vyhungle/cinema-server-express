import { model, Schema } from "mongoose";

const premiereSchema = new Schema({
  movie: {
    type: Schema.Types.ObjectId,
    ref: "movies",
  },
  screenDetail: {
    type: Schema.Types.ObjectId,
    ref: "screendetails",
  },
});

module.exports = model("premieres", premiereSchema);
