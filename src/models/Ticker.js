import { Schema, model } from "mongoose";

const tickerSchema = new Schema({
  seatName: String,
  price: Number,
  status: Boolean,
  premiere: {
    type: Schema.Types.ObjectId,
    ref: "premieres",
  },
});
module.exports = model("tickers", tickerSchema);
