import { model, Schema } from "mongoose";

const roomSchema = new Schema({
  name: String,
  rowNumber: Number,
  seatsInRow: Number,
  screen: {
    type: Schema.Types.ObjectId,
    ref: "screens",
  },
  cinema: {
    type: Schema.Types.ObjectId,
    ref: "cinemas",
  },
});

module.exports = model("rooms", roomSchema);
