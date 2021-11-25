import { model, Schema } from "mongoose";

const movieBillSchema = new Schema({
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
  room: {
    type: Schema.Types.ObjectId,
    ref: "rooms",
  },
  movie: {
    type: Schema.Types.ObjectId,
    ref: "movies",
  },
  total: Number,
  createdAt: String,
  paymentType: Number,
});

module.exports = model("moviebills", movieBillSchema);
