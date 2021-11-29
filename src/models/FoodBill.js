import { model, Schema } from "mongoose";

const foodBillSchema = new Schema({
  billId: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  cinema: {
    type: Schema.Types.ObjectId,
    ref: "cinemas",
  },
  showTime: {
    type: Schema.Types.ObjectId,
    ref: "showtimes",
  },
  showTimeDetail: {
    type: Schema.Types.ObjectId,
    ref: "showtimedetails",
  },
  movieName: String,
  roomName: String,
  screenName: String,
  total: Number,
  createdAt: String,
  paymentType: Number,
});

module.exports = model("foodbills", foodBillSchema);
