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
import { connetEvent, disconnectEvent } from "./sockets/roomSocket";

const timezone = "UTC";
process.env.TZ = timezone;

const app = express();

app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session(sessionConfig));
app.use(cors());
app.use("/uploads", express.static("uploads"));
app.use("/api", api);

mongoose.connect(
  DB_END_POINT,
  {
    useNewUrlParser: true,
  },
);

console.log("Success to connect with DB");
export const server = app.listen(8080, () => {
  console.log("Example app listening on port 8080!");
});

export const io = socketIO.listen(server);
io.on("connection", async (socket: socketIO.Socket) => {
  try {
    await connetEvent(socket);
    socket.on("createCard", async () => {});
    socket.on("disconnect", async () => {
      await disconnectEvent(socket);
    });
  } catch (err) {
    socket.disconnect();
  }
});
