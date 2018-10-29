import express from "express";
import { ModelPopulateOptions } from "mongoose";
import { Comment, CommentModel } from "../models/CommentModel";
import { Card, CardModel } from "../models/CardModel";
import { checkAuth, checkInRoom, checkOwnComment } from "../middlewares/auth";
import ERROR from "../consts/error";

const router = express.Router();

export const commentPopulationOption: ModelPopulateOptions[] = [
  { path: "author", select: { username: 1 } },
];

router.get(
  "/:roomUrl/:id",
  checkAuth,
  checkInRoom,
  async (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.params;
      const comment = await CommentModel.findById(id).populate(
        commentPopulationOption,
      );
      return res.send(comment);
    } catch (err) {
      return res.status(404).send(err);
    }
  },
);

// update
router.put(
  "/:roomUrl/:id",
  checkAuth,
  checkInRoom,
  checkOwnComment,
  async (req: express.Request, res: express.Response) => {
    try {
      const { content } = req.body;
      const comment: Comment = res.locals.comment;

      const updatedComment = await CommentModel.findByIdAndUpdate(
        comment._id,
        {
          content,
        },
        { new: true },
      )
        .populate(commentPopulationOption)
        .exec();
      if (!updatedComment) {
        throw ERROR.FAILED_TO_UPDATE;
      }
      return res.send(updatedComment);
    } catch (err) {
      return res.status(500).send(err);
    }
  },
);

// delete
router.delete(
  "/:roomUrl/:id",
  checkAuth,
  checkInRoom,
  checkOwnComment,
  async (req: express.Request, res: express.Response) => {
    try {
      const card: Card = res.locals.card;
      const comment: Comment = res.locals.comment;

      await CardModel.findByIdAndUpdate(card._id, {
        $pull: {
          comments: comment._id,
        },
      }).exec();

      await comment.remove();
      return res.send(comment);
    } catch (err) {
      return res.status(500).send(err);
    }
  },
);

export default router;
