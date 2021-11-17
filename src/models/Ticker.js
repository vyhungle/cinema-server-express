import { Schema, model } from "mongoose";

const ticketSchema = new Schema({
  idSeat: String,
  seatName: String,
  price: {
    type: Number,
    default: 0,
  },
  status: {
    type: Number,
    default: 0,
  },
  type: {
    type: Number,
    default: 0,
  },
  showTimeDetail: {
    type: Schema.Types.ObjectId,
    ref: "showtimedetails",
  },
  dateEx: {
    type: Number,
    default: 0,
  },
  wail: {
    type: Boolean,
    default: false,
  },
});
module.exports = model("tickets", ticketSchema);
