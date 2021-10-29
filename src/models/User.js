import { model, Schema } from "mongoose";

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profile: {
    fullName: String,
    avatar: String,
    dateOfBirth: String,
    hobby: String,
    male: Boolean,
    address: {
      city: String,
      district: String,
      ward: String,
      street: String,
      lat: String,
      lng: String,
    },
  },
  point: Number,
  createdAt: {
    type: String,
    default: new Date().toISOString(),
  },
});

module.exports = model("users", userSchema);
