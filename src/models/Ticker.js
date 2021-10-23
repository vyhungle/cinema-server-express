import { Schema, model } from "mongoose";

const tickerSchema = new Schema({
  seatName: String,
  price: Number,
  status: Boolean,
  showTimeDetail: {
    type: Schema.Types.ObjectId,
    ref: "showtimedetails",
  },
});
module.exports = model("tickers", tickerSchema);
