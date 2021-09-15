import { model, Schema } from "mongoose";

const castSchema = new Schema({
  name: String,
  dateOfBirth: String,
  image: String,
  joinDate: String,
  address: String,
  phoneNumber: String,
  email: String,
  introduce: String,
  male: Boolean,
  createdAt: {
    type: String,
    default: new Date().toISOString(),
  },
});

module.exports = model("casts", castSchema);
