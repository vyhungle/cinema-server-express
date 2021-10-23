import { model, Schema } from "mongoose";

const showTimeDetailSchema = new Schema({
  date: String,
  room: {
    type: Schema.Types.ObjectId,
    ref: "rooms",
  },
  showTime: {
    type: Schema.Types.ObjectId,
    ref: "showtimes",
  },
  timeSlot: {
    type: Schema.Types.ObjectId,
    ref: "timeslots",
  },
});

module.exports = model("showtimedetails", showTimeDetailSchema);
