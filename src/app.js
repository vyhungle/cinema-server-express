import express from "express";
import cors from "cors";
import http from "http";
import timeout from "connect-timeout";

import { ConnectionMongoDB } from "./config/mongodb";
import testRouter from "./routers/test";
import authRouter from "./routers/auth";
import castRouter from "./routers/cast";
import directorRouter from "./routers/director";
import categoryRouter from "./routers/category";
import movieRouter from "./routers/movie";
import cinemaRouter from "./routers/cinema";
import permissionRouter from "./routers/permission";
import staffRouter from "./routers/staff";
import screenRouter from "./routers/screen";
import roomRouter from "./routers/room";
import timeSlotRouter from "./routers/timeSlot";
import categoryDetailRouter from "./routers/categoryDetail";
import showTimeRouter from "./routers/showTime";
import tickerRouter from "./routers/ticker";
import screenDetailRouter from "./routers/screenDetail";
import movieDetailRouter from "./routers/movieDetail";
import foodRouter from "./routers/food";
import billRouter from "./routers/bill";
import couponRouter from "./routers/coupon";
import paymentRouter from "./routers/payment";

//CORS middleware

require("dotenv").config();
const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    optionsSuccessStatus: 200,
    methods: "GET, PUT",
  })
);

app.set("json spaces", 2);

//Router
app.use("/api/test", testRouter);
app.use("/api/auth", authRouter);
app.use("/api/cast", castRouter);
app.use("/api/director", directorRouter);
app.use("/api/category", categoryRouter);
app.use("/api/movie", movieRouter);
app.use("/api/cinema", cinemaRouter);
app.use("/api/permission", permissionRouter);
app.use("/api/staff", staffRouter);
app.use("/api/screen", screenRouter);
app.use("/api/room", roomRouter);
app.use("/api/timeSlot", timeSlotRouter);
app.use("/api/categoryDetail", categoryDetailRouter);
app.use("/api/showTime", showTimeRouter);
app.use("/api/ticker", tickerRouter);
app.use("/api/screenDetail", screenDetailRouter);
app.use("/api/movieDetail", movieDetailRouter);
app.use("/api/food", foodRouter);
app.use("/api/bill", billRouter);
app.use("/api/coupon", couponRouter);
app.use("/api/payment", paymentRouter);

//Connect db
ConnectionMongoDB();

server.listen(process.env.PORT, () => {
  console.log(`Server running at http://localhost:${process.env.PORT}/`);
});
