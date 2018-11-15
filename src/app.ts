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
import { RoomModel } from "./models/RoomModel";
import { UserModel } from "./models/UserModel";
import { populateRoomOption } from "./controllers/roomController";
import ERROR from "./consts/error";

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
io.on("connection", async (socket: socketIO.Socket) => {
  try {
    const query = socket.handshake.query;
    const { type } = query;
    if (type === "enter") {
      const { token, roomUrl } = query;
      if (token && roomUrl) {
        const user = await UserModel.findOne({ token });
        if (user) {
          const room = await RoomModel.findOneAndUpdate(
            { url: roomUrl },
            { $push: { participants: user._id } },
            { new: true },
          )
            .populate(populateRoomOption)
            .exec();
          if (!room) {
            throw ERROR.NO_ROOM;
          }
          io.sockets.emit("enter", { room });
        }
      }
    }

    socket.on("disconnect", async () => {
      console.log("disconnect");
      if (query.token && query.roomUrl) {
        const { token, roomUrl } = query;
        const user = await UserModel.findOne({ token });
        if (user) {
          const room = await RoomModel.findOneAndUpdate(
            { url: roomUrl },
            { $pull: { participants: user._id } },
            { new: true },
          )
            .populate(populateRoomOption)
            .exec();
          if (!room) {
            throw ERROR.NO_ROOM;
          }
          io.sockets.emit("leave", { room });
        }
      }
    });
  } catch (err) {
    socket.disconnect();
  }
});
