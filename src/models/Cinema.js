import { model, Schema } from "mongoose";

const cinemaSchema = new Schema({
  name: String,
  address: {
    city: String,
    district: String,
    ward: String,
    street: String,
    lat: String,
    lng: String,
  },
  createdAt: {
    type: String,
    default: new Date().toISOString(),
  },
  payments: [],
});

module.exports = model("cinemas", cinemaSchema);
