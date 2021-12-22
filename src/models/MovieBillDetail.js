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
  price: { type: Number, default: 0 },
  promotion: { type: Number, default: 0 },
  priceSell: { type: Number, default: 0 },
  promotionType: { type: String, default: "Không dùng khuyến mãi" },

});

module.exports = model("moviebilldetails", movieBillDetailSchema);
