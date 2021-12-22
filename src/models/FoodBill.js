import { model, Schema } from "mongoose";
import { STAFF_DEFAULT, USER_DEFAULT } from "../utils/constaints";

const foodBillSchema = new Schema({
  billId: String,
  user: {
    type: Schema.Types.ObjectId,
    default: USER_DEFAULT,
    ref: "users",
  },
  staff: {
    type: Schema.Types.ObjectId,
    default: STAFF_DEFAULT,
    ref: "staffs",
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
  createdAt: Date,
  promotion: { type: Number, default: 0 },
  paymentType: Number,
});

module.exports = model("foodbills", foodBillSchema);
