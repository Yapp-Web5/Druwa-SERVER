import express from "express";
import * as _ from "lodash";
import { Comment, CommentModel } from "../models/CommentModel";
import { RootComment, RootCommentModel } from "../models/RootCommentModel";
import { User, UserModel } from "../models/UserModel";
import { CursorCommentOptions } from "mongodb";

const router = express.Router();

// find
router.get("/:id", async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const data = await CommentModel.findOne({
      _id: id,
    }).populate(["rootComment", "author"]);
    return res.send(data);
  } catch (err) {
    return res.status(404).send(err);
  }
});

// save
router.post("/", async (req: express.Request, res: express.Response) => {
  try {
    const now = new Date();
    const { token } = req.headers;
    const { rootcomment_id, content } = req.body;
    const rootComment = await RootCommentModel.findOne({
      _id: rootcomment_id,
    });
    const user = await UserModel.findOne({ token });
    if (rootComment && user) {
      const commentObject = {
        rootComment: rootComment._id,
        author: user._id,
        content: content as string,
        createdAt: now,
        updatedAt: now,
      } as Partial<Comment>;

      const comment = new CommentModel(commentObject);
      const result = await comment.save();
      await rootComment.update({
        comments: rootComment.comments.concat(comment),
      });
      await rootComment.save();
      return res.send(result);
    } else {
      return res.send("failed");
    }
  } catch (err) {
    return res.status(500).send(err);
  }
});

// update
router.put("/:id", async (req: express.Request, res: express.Response) => {
  try {
    const { token } = req.headers;
    const { id } = req.params;
    const { content } = req.body;

    const comment = await CommentModel.findOne({ _id: id });
    const user = await UserModel.findOne({ token });

    if (comment && user) {
      if (comment.author.token !== token) {
        throw new Error("The user is not author of this comment");
      }

      const result = await comment.update({ content });
      return res.send(result);
    }
    throw new Error("Failed to find comment or user");
  } catch (err) {
    return res.status(500).send(err);
  }
});

// delete
router.delete("/:id", async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const { token } = req.headers;

    const user = await UserModel.findOne({ token });
    const comment = await CommentModel.findOne({ _id: id });

    if (user && comment) {
      if (user.token !== token) {
        throw new Error("The use is not author of this comment");
      }

      const result = await comment.remove();
      return res.send(result);
    }
    throw new Error("Failed to find comment or user");
  } catch (err) {
    return res.status(500).send(err);
  }
});

export default router;
