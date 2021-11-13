import { model, Schema } from "mongoose";

const InviteSchema = new Schema({
  email: String,
  token: String,
  dateEX: String,
  status: {
    type: Boolean,
    default: true,
  },
});

module.exports = model("Invites", InviteSchema);
