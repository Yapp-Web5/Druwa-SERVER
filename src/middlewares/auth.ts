import express from "express";
import { findIndex } from "lodash";

import { UserModel, User } from "../models/UserModel";
import ERROR from "../consts/error";
import { RoomModel, Room } from "../models/RoomModel";
import { populateRoomOption } from "../controllers/roomController";
import { cardPopulateOption } from "../controllers/cardController";
import { CardModel } from "../models/CardModel";
import { CommentModel } from "../models/CommentModel";

export const checkAuth = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    const token = req.headers.token;
    if (!token) {
      throw ERROR.NO_TOKEN;
    }
    const user = await UserModel.findOne({ token }, { password: 0 });
    if (!user) {
      throw ERROR.INVALID_TOKEN;
    }
    res.locals.user = user;
    return next();
  } catch (err) {
    return res
      .status(err.status || 500)
      .send({ message: err.message || err.toString() });
  }
};

export const checkInRoom = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    const { roomUrl } = req.params;
    const room = await RoomModel.findOne({ url: roomUrl })
      .populate([
        { path: "admins", select: { username: 1 } },
        { path: "participants", select: { username: 1 } },
        { path: "cards", populate: cardPopulateOption },
      ])
      .exec();
    if (!room) {
      throw ERROR.NO_ROOM;
    }
    const user: User = res.locals.user;
    if (!user) {
      throw ERROR.INVALID_TOKEN;
    }
    const inRoom =
      findIndex(room.participants, participant => {
        return participant._id.equals(user._id);
      }) !== -1;
    if (!inRoom) {
      throw ERROR.NO_PERMISSION;
    }

    res.locals.room = room;
    return next();
  } catch (err) {
    return res
      .status(err.status || 500)
      .send({ message: err.message || err.toString() });
  }
};

export const checkOwnCard = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    const { id } = req.params;
    const user: User = res.locals.user;
    const room: Room = res.locals.room;

    const cardInRoom =
      findIndex(room.cards, item => {
        return item._id.equals(id);
      }) !== -1;

    if (!cardInRoom) {
      throw ERROR.NO_CARD;
    }

    const card = await CardModel.findById(id).populate(cardPopulateOption);
    if (!card) {
      throw ERROR.NO_CARD;
    }
    const isMine = card.author._id.equals(user._id);
    if (!isMine) {
      throw ERROR.NO_PERMISSION;
    }
    res.locals.card = card;
    next();
  } catch (err) {
    return res
      .status(err.status || 500)
      .send({ message: err.message || err.toString() });
  }
};

export const checkOwnComment = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    const { id } = req.params;
    const user: User = res.locals.user;
    const room: Room = res.locals.room;

    const comment = await CommentModel.findById(id);
    if (!comment) {
      throw ERROR.NO_COMMENT;
    }

    const card = await CardModel.findById(comment.parentCard).populate(
      cardPopulateOption,
    );
    if (!card) {
      throw ERROR.NO_CARD;
    }

    const cardInRoom =
      findIndex(room.cards, item => {
        return item._id.equals(card._id);
      }) !== -1;

    if (!cardInRoom) {
      throw ERROR.NO_CARD;
    }

    const commentInRoom =
      findIndex(card.comments, item => {
        return item._id.equals(comment._id);
      }) !== -1;

    if (!commentInRoom) {
      throw ERROR.NO_COMMENT;
    }

    const isMine = comment.author._id.equals(user._id);
    if (!isMine) {
      throw ERROR.NO_PERMISSION;
    }

    res.locals.card = card;
    res.locals.comment = comment;
    next();
  } catch (err) {
    return res
      .status(err.status || 500)
      .send({ message: err.message || err.toString() });
  }
};
