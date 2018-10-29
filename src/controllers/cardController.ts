import express from "express";
import { ModelPopulateOptions } from "mongoose";
import { Card, CardModel } from "../models/CardModel";
import { User } from "../models/UserModel";
import { RoomModel, Room } from "../models/RoomModel";
import ERROR from "../consts/error";
import { Comment, CommentModel } from "../models/CommentModel";
import { checkAuth, checkInRoom, checkOwnCard } from "../middlewares/auth";
import { commentPopulationOption } from "./commentController";

const router = express.Router();

export const cardPopulateOption: ModelPopulateOptions[] = [
  { path: "author", select: { username: 1 } },
  { path: "comments", populate: commentPopulationOption },
  { path: "likes", select: { username: 1 } },
];

router.get(
  "/:roomUrl",
  checkAuth,
  checkInRoom,
  async (req: express.Request, res: express.Response, next: any) => {
    try {
      const { roomUrl } = req.params;
      const cards = await CardModel.find({ url: roomUrl }).populate(
        cardPopulateOption,
      );
      return res.send(cards);
    } catch (err) {
      return res
        .status(err.status || 500)
        .send({ message: err.message || err.toString() });
    }
  },
);

router.post(
  "/:roomUrl",
  checkAuth,
  checkInRoom,
  async (req: express.Request, res: express.Response) => {
    try {
      const { roomUrl } = req.params;
      const { content, refPageIdx } = req.body;
      const room: Room = res.locals.room;
      const user: User = res.locals.user;
      const now = new Date();
      const cardObject = {
        author: user._id,
        roomUrl,
        content,
        createdAt: now,
        updatedAt: now,
        refPageIdx,
      } as Partial<Card>;

      const card = new CardModel(cardObject).populate(cardPopulateOption);
      const data = await card.save();

      await room
        .update({
          $push: {
            cards: data._id,
          },
        })
        .exec();
      await room.save();
      return res.send(data);
    } catch (err) {
      return res
        .status(err.status || 500)
        .send({ message: err.message || err.toString() });
    }
  },
);

router.put(
  "/:roomUrl/:id",
  checkAuth,
  checkInRoom,
  checkOwnCard,
  async (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.params;
      const { content, refPageIdx } = req.body;
      const updatedCard = await CardModel.findByIdAndUpdate(
        id,
        {
          content,
          refPageIdx,
          updatedAt: new Date(),
        },
        { new: true },
      )
        .populate(cardPopulateOption)
        .exec();
      if (!updatedCard) {
        throw ERROR.FAILED_TO_UPDATE;
      }
      return res.send(updatedCard);
    } catch (err) {
      return res
        .status(err.status || 500)
        .send({ message: err.message || err.toString() });
    }
  },
);

router.delete(
  "/:roomUrl/:id",
  checkAuth,
  checkInRoom,
  checkOwnCard,
  async (req: express.Request, res: express.Response) => {
    try {
      const card: Card = res.locals.card;
      await RoomModel.findOneAndUpdate(
        { url: card.roomUrl },
        {
          $pull: {
            cards: card._id,
          },
        },
      );
      await card.remove();
      return res.send(card);
    } catch (err) {
      return res
        .status(err.status || 500)
        .send({ message: err.message || err.toString() });
    }
  },
);

router.put(
  "/:roomUrl/:id/like",
  checkAuth,
  checkInRoom,
  async (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.params;
      const user: User = res.locals.user;
      const card = await CardModel.findById(id).populate("author");
      if (!card) {
        throw ERROR.NO_CARD;
      }

      const updatedCard = await CardModel.findByIdAndUpdate(
        id,
        {
          $addToSet: {
            likes: user._id,
          },
        },
        { new: true },
      )
        .populate(cardPopulateOption)
        .exec();
      if (!updatedCard) {
        throw ERROR.FAILED_TO_UPDATE;
      }
      return res.send(updatedCard);
    } catch (err) {
      return res
        .status(err.status || 500)
        .send({ message: err.message || err.toString() });
    }
  },
);

router.put(
  "/:roomUrl/:id/unlike",
  checkAuth,
  checkInRoom,
  async (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.params;
      const user: User = res.locals.user;
      const card = await CardModel.findById(id).populate("author");
      if (!card) {
        throw ERROR.NO_CARD;
      }

      const updatedCard = await CardModel.findByIdAndUpdate(
        id,
        {
          $pull: {
            likes: user._id,
          },
        },
        { new: true },
      )
        .populate(cardPopulateOption)
        .exec();
      if (!updatedCard) {
        throw ERROR.FAILED_TO_UPDATE;
      }
      return res.send(updatedCard);
    } catch (err) {
      return res
        .status(err.status || 500)
        .send({ message: err.message || err.toString() });
    }
  },
);

router.post(
  "/:roomUrl/:id/comments",
  checkAuth,
  checkInRoom,
  async (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.params;
      const user: User = res.locals.user;
      const { content } = req.body;

      const card = await CardModel.findById(id).populate("author");
      if (!card) {
        throw ERROR.NO_CARD;
      }

      const now = new Date();
      const commentObject = {
        parentCard: id,
        author: user._id,
        content,
        createdAt: now,
        updatedAt: now,
      } as Partial<Comment>;

      const comment = new CommentModel(commentObject);
      await comment.save();

      const updatedCard = await CardModel.findByIdAndUpdate(
        id,
        {
          $push: {
            comments: comment._id,
          },
        },
        { new: true },
      )
        .populate(cardPopulateOption)
        .exec();
      if (!updatedCard) {
        throw ERROR.FAILED_TO_UPDATE;
      }
      return res.send(updatedCard);
    } catch (err) {
      return res
        .status(err.status || 500)
        .send({ message: err.message || err.toString() });
    }
  },
);

export default router;
