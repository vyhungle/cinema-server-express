import { model, Schema } from "mongoose";

const staffSchema = new Schema({
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
    male: Boolean,
    address: String,
  },
  createdAt: {
    type: String,
    default: new Date().toISOString(),
  },
  permission: {
    type: Schema.Types.ObjectId,
    ref: "permissions",
  },
  cinema: {
    type: Schema.Types.ObjectId,
    ref: "cinemas",
  },
});

module.exports = model("staffs", staffSchema);
