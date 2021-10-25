import { Schema, model } from "mongoose";

const tickerSchema = new Schema({
  idSeat: String,
  seatName: String,
  price: Number,
  status: Number,
  showTimeDetail: {
    type: Schema.Types.ObjectId,
    ref: "showtimedetails",
  },
});
module.exports = model("tickers", tickerSchema);
