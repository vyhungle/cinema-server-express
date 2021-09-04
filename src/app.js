import express from "express";
import cors from "cors";
import http from "http";

import { ConnectionMongoDB } from "./config/mongodb";
import authRouter from './routers/auth'

require("dotenv").config();
const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cors());
app.set("json spaces", 2);

//Router
app.use("/api/auth", authRouter);

//Connect db
ConnectionMongoDB();

server.listen(process.env.PORT, () => {
  console.log(`Server running at http://localhost:${process.env.PORT}/`);
});
