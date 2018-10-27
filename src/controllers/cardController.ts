import express from "express";
import { Card, CardModel } from "../models/CardModel";
import { User } from "../models/UserModel";
import { RoomModel } from "../models/RoomModel";
import { checkAuth } from "../middlewares/auth";
import ERROR from "../consts/error";

const router = express.Router();

export const cardPopulateOption = [
  { path: "author", select: { username: 1 } },
  { path: "comments", select: { username: 1 } },
  { path: "likes", select: { username: 1 } },
];

const populateCard = async (card: Card) => {
  const result = await card.populate(cardPopulateOption).execPopulate();
  return result;
};

router.get(
  "/:url",
  checkAuth,
  async (req: express.Request, res: express.Response, next: any) => {
    try {
      const { url } = req.params;
      const user: User = res.locals.user;

      const room = await RoomModel.findOne({ url });
      if (!room) {
        throw ERROR.NO_ROOM;
      }

      if (room.participants.indexOf(user._id) === -1) {
        throw ERROR.NO_PERMISSION;
      }

      const cards = await CardModel.find({ roomUrl: url }).populate(
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
  "/:url",
  checkAuth,
  async (req: express.Request, res: express.Response) => {
    try {
      const { url } = req.params;
      const { content, refPageIdx } = req.body;
      const room = await RoomModel.findOne({ url });
      if (!room) {
        throw ERROR.NO_ROOM;
      }

      const user: User = res.locals.user;
      const now = new Date();
      const cardObject = {
        author: user._id,
        roomUrl: url,
        content,
        createdAt: now,
        updatedAt: now,
        refPageIdx,
      };

      const card = new CardModel(cardObject);
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
  "/:id",
  checkAuth,
  async (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.params;
      const user: User = res.locals.user;
      const { content, refPageIdx } = req.body;

      const card = await CardModel.findById(id).populate("author");
      if (!card) {
        throw ERROR.NO_CARD;
      }

      if (card.author.token !== user.token) {
        throw ERROR.NO_PERMISSION;
      }

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
  "/:id",
  checkAuth,
  async (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.params;
      const user: User = res.locals.user;
      const card = await CardModel.findById(id).populate("author");
      if (!card) {
        throw ERROR.NO_CARD;
      }

      if (card.author.token !== user.token) {
        throw ERROR.NO_PERMISSION;
      }

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

export default router;
