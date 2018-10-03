import express from "express";
import cors from "cors";
import session from "express-session";
import sessionConfig from "./configs/session";
import logger from "morgan";
import * as bodyParser from "body-parser";
import api from "./api";
import * as socketIO from "socket.io";
import mongoose from "mongoose";
import { DB_END_POINT } from "./configs/db";
import { generateNickname } from "./consts/nickname";
import * as crypto from "crypto-js";

const timezone = "UTC";
process.env.TZ = timezone;

const app = express();

app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session(sessionConfig));
app.use(cors());

app.use("/api", api);

mongoose.connect(
  DB_END_POINT,
  {
    useNewUrlParser: true,
  },
);

console.log("Success to connect with DB");
console.log(generateNickname());
const server = app.listen(8080, () => {
  console.log("Example app listening on port 8080!");
});

const io = socketIO.listen(server);
io.on("connection", (socket: socketIO.Socket) => {
  console.log("a user connected");
  const query = socket.handshake.query;
  console.log(socket.handshake.query);
  console.log(query.token);
  if (query.token === "null") {
    console.log("generate token");
    const token = crypto.SHA256(new Date().toString()).toString();
    socket.send({
      token,
    });
  }
});
