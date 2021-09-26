import { model, Schema } from "mongoose";

const showTimeSchema = new Schema({
  screenDetail: {
    type: Schema.Types.ObjectId,
    ref: "screenDetails",
  },
  fare: Number,
  status: Boolean,
  moveDuration: Number,
});

module.exports = model("showTimes", showTimeSchema);
