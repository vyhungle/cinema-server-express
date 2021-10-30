import { model, Schema } from "mongoose";

const movieBillDetailSchema = new Schema({
  movieBill: {
    type: Schema.Types.ObjectId,
    ref: "moviebills",
  },
  ticket: {
    type: Schema.Types.ObjectId,
    ref: "tickets",
  },
});

module.exports = model("moviebilldetails", movieBillDetailSchema);
