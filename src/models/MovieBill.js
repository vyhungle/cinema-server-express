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
  total: Number,
  createdAt: String,
  paymentType: Number,
});

module.exports = model("moviebills", movieBillSchema);
