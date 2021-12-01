import { model, Schema } from "mongoose";

const movieBillSchema = new Schema({
  billId: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  showTime: {
    type: Schema.Types.ObjectId,
    ref: "showtimes",
  },
  showTimeDetail: {
    type: Schema.Types.ObjectId,
    ref: "showtimedetails",
  },
  cinema: {
    type: Schema.Types.ObjectId,
    ref: "cinemas",
  },
  movieName: String,
  roomName: String,
  screenName: String,
  total: Number,
  createdAt: Date,
  promotion: { type: Number, default: 0 },
  paymentType: Number,
});

module.exports = model("moviebills", movieBillSchema);
