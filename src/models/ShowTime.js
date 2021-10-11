import { model, Schema } from "mongoose";

const showTimeSchema = new Schema({
  status: Boolean,
  cinema: {
    type: Schema.Types.ObjectId,
    ref: "cinemas",
  },
  screenDetail: {
    type: Schema.Types.ObjectId,
    ref: "screendetails",
  },
});

module.exports = model("showtimes", showTimeSchema);
