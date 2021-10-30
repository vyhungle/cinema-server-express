import { model, Schema } from "mongoose";

const movieBillSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  total: Number,
  createdAt: String,
  paymentType: Number,
});

module.exports = model("moviebills", movieBillSchema);
