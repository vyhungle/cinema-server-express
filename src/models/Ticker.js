import { Schema, model } from "mongoose";

const tickerSchema = new Schema({
  seatName: String,
  price: Number,
  status: Boolean,
  showTime: {
    type: Schema.Types.ObjectId,
    ref: "showtimes",
  },
});
module.exports = model("tickers", tickerSchema);
