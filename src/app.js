import express from "express";
import cors from "cors";
import http from "http";

import { ConnectionMongoDB } from "./config/mongodb";
import authRouter from "./routers/auth";
import otpRouter from "./routers/otp";
import castRouter from "./routers/cast";
import directorRouter from "./routers/director";
import categoryRouter from "./routers/category";
import movieRouter from "./routers/movie";
import nationRouter from "./routers/nation";

require("dotenv").config();
const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.set("json spaces", 2);

//Router
app.use("/api/auth", authRouter);
app.use("/api/otp", otpRouter);
app.use("/api/cast", castRouter);
app.use("/api/director", directorRouter);
app.use("/api/category", categoryRouter);
app.use("/api/movie", movieRouter);
app.use("/api/nation", nationRouter);

//Connect db
ConnectionMongoDB();

server.listen(process.env.PORT, () => {
  console.log(`Server running at http://localhost:${process.env.PORT}/`);
});
