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
  countTicket: {
    type: Number,
    default: 0,
  },
  totalPrice: {
    type: Number,
    default: 0,
  },
});

module.exports = model("showtimedetails", showTimeDetailSchema);
