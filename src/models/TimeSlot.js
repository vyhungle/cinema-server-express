import { model, Schema } from "mongoose";

const timeSlotSchema = new Schema({
  name: String,
  time: String,
});

module.exports = model("timeslots", timeSlotSchema);
