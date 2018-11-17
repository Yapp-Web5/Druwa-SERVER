import * as socketIO from "socket.io";
import { UserModel } from "../models/UserModel";
import { RoomModel } from "../models/RoomModel";
import { populateRoomOption } from "../controllers/roomController";
import ERROR from "../consts/error";
import { io } from "../app";

export const connetEvent = async (socket: socketIO.Socket) => {
  console.log("connect");
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
        socket.join(roomUrl);
        io.to(roomUrl).emit("enter", { room });
      }
    }
  }
};

export const disconnectEvent = async (socket: socketIO.Socket) => {
  console.log("disconnect");
  const query = socket.handshake.query;
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
      socket.leave(roomUrl);
      io.to(roomUrl).emit("leave", { room });
    }
  }
};
