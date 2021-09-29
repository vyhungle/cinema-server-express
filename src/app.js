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
import cinemaRouter from "./routers/cinema";
import permissionRouter from "./routers/permission";
import staffRouter from "./routers/staff";
import screenRouter from "./routers/screen";
import calendarRouter from "./routers/calendar";
import roomRouter from "./routers/room";
import timeSlotRouter from "./routers/timeSlot";
import roomDetailRouter from "./routers/roomDetail";
import premiereRouter from "./routers/premiere";
import categoryDetailRouter from "./routers/categoryDetail";

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
app.use("/api/cinema", cinemaRouter);
app.use("/api/permission", permissionRouter);
app.use("/api/staff", staffRouter);
app.use("/api/screen", screenRouter);
app.use("/api/calendar", calendarRouter);
app.use("/api/room", roomRouter);
app.use("/api/timeSlot", timeSlotRouter);
app.use("/api/roomDetail", roomDetailRouter);
app.use("/api/premiere", premiereRouter);
app.use("/api/categoryDetail", categoryDetailRouter);

//Connect db
ConnectionMongoDB();

server.listen(process.env.PORT, () => {
  console.log(`Server running at http://localhost:${process.env.PORT}/`);
});
