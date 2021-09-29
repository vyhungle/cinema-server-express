import { model, Schema } from "mongoose";

const premiereSchema = new Schema({
  screen: {
    type: Schema.Types.ObjectId,
    ref: "screens",
  },
  movie: {
    type: Schema.Types.ObjectId,
    ref: "movies",
  },
});

module.exports = model("premieres", premiereSchema);
