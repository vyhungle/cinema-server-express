import { model, Schema } from "mongoose";

const showTimeSchema = new Schema({
  price: Number,
  status: Boolean,
  moveDuration: Number,
  date: String,
  screenDetail: {
    type: Schema.Types.ObjectId,
    ref: "screenDetails",
  },
  cinema: {
    type: Schema.Types.ObjectId,
    ref: "cinemas",
  },
  timeSlot: {
    type: Schema.Types.ObjectId,
    ref: "timeslots",
  },
});

module.exports = model("showTimes", showTimeSchema);
