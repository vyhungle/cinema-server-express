import { model, Schema } from "mongoose";

const showTimeDetailSchema = new Schema({
  date: String,
  room: {
    type: Schema.Types.ObjectId,
    ref: "rooms",
  },
  showTime: {
    type: Schema.Types.ObjectId,
    ref: "showtimes",
  },
  timeSlot: {
    type: Schema.Types.ObjectId,
    ref: "timeslots",
  },

  // Field để thống kê
  // TK số lượng vé
  countTicket: {
    type: Number,
    default: 0,
  },
  countTicketPoint: {
    type: Number,
    default: 0,
  },
  countTicketCoupon: {
    type: Number,
    default: 0,
  },
  // TK tiền bán vé
  totalPriceTicket: {
    type: Number,
    default: 0,
  },
  totalPriceTicketPoint: {
    type: Number,
    default: 0,
  },
  totalPriceTicketCoupon: {
    type: Number,
    default: 0,
  },
  // TK tiền bán bắp nước
  totalPriceFood: {
    type: Number,
    default: 0,
  },
  totalPriceFoodPoint: {
    type: Number,
    default: 0,
  },
  totalPriceFoodCoupon: {
    type: Number,
    default: 0,
  },
});

module.exports = model("showtimedetails", showTimeDetailSchema);
