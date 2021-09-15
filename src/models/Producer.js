import { model, Schema } from "mongoose";

const producerSchema = new Schema({
  name: String,
  address: String,
  phoneNumber: String,
  email: String,
});

module.exports = model("producers", producerSchema);
