import { model, Schema } from "mongoose";

const timeSlotSchema = new Schema({
  time: String,
});

module.exports = model("timeSlots", timeSlotSchema);
