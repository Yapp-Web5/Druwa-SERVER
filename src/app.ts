import express from "express";
import cors from "cors";
import session from "express-session";
import sessionConfig from "./configs/session";
import logger from "morgan";
import mongoose from "mongoose";
import * as bodyParser from "body-parser";
import * as socketIO from "socket.io";

import api from "./api";
import swagger from "./swagger";

import { DB_END_POINT } from "./configs/db";
import { generateNickname } from "./consts/nickname";
import { RoomModel } from "./models/RoomModel";
import { UserModel } from "./models/UserModel";

const timezone = "UTC";
process.env.TZ = timezone;

const app = express();

app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session(sessionConfig));
app.use(cors());

app.use("/api", api);
app.use("/docs", swagger);

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
io.on("connection", async (socket: socketIO.Socket) => {
  try {
    console.log("a user connected");
    const query = socket.handshake.query;
    socket.on("disconnect", async () => {
      console.log("disconnect");
      if (query.token && query.roomUrl) {
        const { token, roomUrl } = query;
        const user = await UserModel.findOne({ token });
        if (user) {
          await RoomModel.update(
            { url: roomUrl },
            { $pull: { participants: user._id } },
          );
          const room = await RoomModel.findOne({ url: roomUrl });
          if (room) {
            socket.broadcast.emit("newEnter", { room });
          }
          return socket.send({ room });
        }
      }
    });

    if (query.token && query.roomUrl) {
      const { token, roomUrl } = query;
      const user = await UserModel.findOne({ token });
      if (user) {
        await RoomModel.update(
          { url: roomUrl },
          { $push: { participants: user._id } },
        );
        const room = await RoomModel.findOne({ url: roomUrl });
        if (room) {
          socket.broadcast.emit("newEnter", { room });
        }
        return socket.send({ room });
      }

      // console.log("generate token");
      // const token = crypto.SHA256(new Date().toString()).toString();
      // socket.send({
      //   token,
      // });
    }
  } catch (err) {
    return socket.disconnect();
  }
});
