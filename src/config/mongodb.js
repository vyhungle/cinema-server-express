const mongoose = require("mongoose");
require("dotenv").config();

export function ConnectionMongoDB() {
  mongoose
    .connect(process.env.DB_CONNECT_STRING, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })
    .then(() => {
      console.log("MongoDB connected");
    })
    .catch((err) => {
      console.log(err);
    });
}
