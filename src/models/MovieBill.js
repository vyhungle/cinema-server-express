import { model, Schema } from "mongoose";

const movieBillSchema = new Schema({
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
  createdAt: String,
  paymentType: Number,
});

module.exports = model("moviebills", movieBillSchema);
