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
});
module.exports = model("tickets", ticketSchema);
