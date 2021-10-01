import { model, Schema } from "mongoose";

const showTimeSchema = new Schema({
  status: Boolean,
  date: String,
  room: {
    type: Schema.Types.ObjectId,
    ref: "rooms",
  },
  premiere: {
    type: Schema.Types.ObjectId,
    ref: "premieres",
  },
  timeSlot: {
    type: Schema.Types.ObjectId,
    ref: "timeslots",
  },
});

module.exports = model("showtimes", showTimeSchema);
