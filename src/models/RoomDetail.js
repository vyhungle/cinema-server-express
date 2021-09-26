import { model, Schema } from "mongoose";

const roomDetailSchema = new Schema({
  room: {
    type: Schema.Types.ObjectId,
    ref: "rooms",
  },
  timeSlot: {
    type: Schema.Types.ObjectId,
    ref: "timeslots",
  },
});

module.exports = model("roomDetails", roomDetailSchema);
