import { model, Schema } from "mongoose";

const paymentBillSchema = new Schema({
  movieBill: {
    type: Schema.Types.ObjectId,
    ref: "moviebills",
  },
  total: Number,
  CreatedAt: String,
});

module.exports = model("paymentbills", paymentBillSchema);
