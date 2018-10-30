import express from "express";
import { findIndex } from "lodash";
import { ModelPopulateOptions } from "mongoose";
import { cardPopulateOption } from "./cardController";
import { Room, RoomModel } from "../models/RoomModel";
import { UserModel, User } from "../models/UserModel";
import { checkAuth } from "../middlewares/auth";
import ERROR from "../consts/error";

const router = express.Router();

export const populateRoomOption: ModelPopulateOptions[] = [
  { path: "admins", select: { username: 1 } },
  { path: "participants", select: { username: 1 } },
  { path: "cards", populate: cardPopulateOption },
];

const ownRoom = (room: Room, user: User) => {
  return (
    findIndex(room.admins, admin => {
      return admin._id.equals(user._id);
    }) !== -1
  );
};

/**
 * @swagger
 * definitions:
 *   Room:
 *     type: object
 *     required:
 *       - url
 *       - lecturer
 *       - title
 *       - description
 *       - admins
 *       - isPublic
 *       - maxParticipants
 *       - participants
 *       - createdAt
 *       - pdfPath
 *       - cards
 *     properties:
 *       url:
 *         type: string
 *       lecturer:
 *         type: stromg
 *       title:
 *         type: string
 *       description:
 *         type: string
 *       admins:
 *         type: User[]
 *       isPublic:
 *         type: boolean
 *       maxParticipants:
 *         type: number
 *       participants:
 *         type: User[]
 *       createdAt:
 *         type: Date
 *       pdfPath:
 *         type: url
 *       cards:
 *         type: Card[]
 *       password:
 *         type: string
 */

/**
 * @swagger
 * /rooms:
 *   post:
 *     tags:
 *       - "create Room"
 *     description: Create the new Room
 *     produces:
 *       - application/json
 *     parameters:
 *        - in: "header"
 *          name: "token"
 *          description: "The token for authentication"
 *          type: "String"
 *          required: true
 *        - in: "body"
 *          name: "lecturer"
 *          description: "The name of lecturer"
 *          type: "String"
 *          required: true
 *     responses:
 *       200:
 *         description: Success to create the new Room
 */

router.post(
  "/",
  checkAuth,
  async (req: express.Request, res: express.Response) => {
    try {
      const user: User = res.locals.user;
      const { lecturer, url, title, description, password, pdfPath } = req.body;
      const roomObject = {
        lecturer: lecturer as string,
        url: url as string,
        title: title as string,
        description: description as string,
        admins: [user._id],
        participants: [user._id],
        comments: [],
        isPublic: !password,
        password,
        maxParticipants: 100,
        createdAt: new Date(),
        pdfPath: pdfPath as string,
      } as Partial<Room>;
      const room = new RoomModel(roomObject).populate(populateRoomOption);
      await room.save();
      await user.update({ $addToSet: { enteredRoom: room._id } }).exec();
      await user.save();
      return res.send(room);
    } catch (err) {
      return res
        .status(err.status || 500)
        .send({ message: err.message || err.toString() });
    }
  },
);

router.get(
  "/:url",
  checkAuth,
  async (req: express.Request, res: express.Response) => {
    try {
      const { url } = req.params;
      const room = await RoomModel.findOne({ url }).populate(
        populateRoomOption,
      );
      if (!room) {
        throw ERROR.NO_ROOM;
      }
      return res.send(room);
    } catch (err) {
      return res
        .status(err.status || 500)
        .send({ message: err.message || err.toString() });
    }
  },
);

router.put(
  "/enter/:url",
  checkAuth,
  async (req: express.Request, res: express.Response) => {
    try {
      const { url } = req.params;
      const user: User = res.locals.user;
      const room = await RoomModel.findOneAndUpdate(
        { url },
        { $addToSet: { participants: user._id } },
        { new: true },
      )
        .populate(populateRoomOption)
        .exec();
      if (!room) {
        throw ERROR.NO_ROOM;
      }
      await room.save();
      await user
        .update({
          $addToSet: {
            enteredRoom: room._id,
          },
        })
        .exec();
      await user.save();
      return res.send(room);
    } catch (err) {
      return res
        .status(err.status || 500)
        .send({ message: err.message || err.toString() });
    }
  },
);

router.put(
  "/admin/:url",
  checkAuth,
  async (req: express.Request, res: express.Response) => {
    try {
      const { url } = req.params;
      const user: User = res.locals.user;
      const { newAdminToken } = req.body;
      const room = await RoomModel.findOne({ url });
      if (!room) {
        throw ERROR.NO_ROOM;
      }
      if (!ownRoom(room, user)) {
        throw ERROR.NO_PERMISSION;
      }
      const newAdminUser = await UserModel.findOne({ token: newAdminToken });
      if (!newAdminUser) {
        throw ERROR.NO_USER;
      }

      const updatedRoom = await RoomModel.findOneAndUpdate(
        { url },
        {
          $addToSet: {
            admin: newAdminUser._id,
          },
        },
        { new: true },
      )
        .populate(populateRoomOption)
        .exec();

      if (!updatedRoom) {
        throw ERROR.FAILED_TO_REGISTER_AS_ADMIN;
      }
      await updatedRoom.save();
      return res.send(updatedRoom);
    } catch (err) {
      return res
        .status(err.status || 500)
        .send({ message: err.message || err.toString() });
    }
  },
);

router.delete(
  "/:url",
  checkAuth,
  async (req: express.Request, res: express.Response) => {
    try {
      const user: User = res.locals.user;
      const { url } = req.params;
      const room = await RoomModel.findOne({ url }).populate(
        populateRoomOption,
      );
      if (!room) {
        throw ERROR.NO_ROOM;
      }
      if (!ownRoom(room, user)) {
        throw ERROR.NO_PERMISSION;
      }
      await UserModel.updateMany(
        { enteredRoom: room._id },
        { $pull: { enteredRoom: room._id } },
      ).exec();
      await room.remove();
      return res.send(room);
    } catch (err) {
      return res
        .status(err.status || 500)
        .send({ message: err.message || err.toString() });
    }
  },
);

export default router;
