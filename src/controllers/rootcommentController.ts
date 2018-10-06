import express, { json } from "express";
import {
  RootComment,
  RootCommentModel,
  RootCommentSchema,
} from "../models/RootCommentModel";
import { User, UserModel } from "../models/UserModel";
import { Schema } from "mongoose";
import { CommentSchema, Comment, CommentModel } from "../models/CommentModel";

const router = express.Router();

router.get("/", async (req: express.Request, res: express.Response) => {
  try {
    const data = await RootCommentModel.find().populate(["author", "comments"]);
    return res.send(data);
  } catch (err) {
    return res.status(404).send(err);
  }
});

router.get("/:id", async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const data = await RootCommentModel.findOne({ _id: id });
    return res.send(data);
  } catch (err) {
    return res.status(404).send(err);
  }
});

router.post("/", async (req: express.Request, res: express.Response) => {
  try {
    const { token } = req.headers;
    const { content, refpageidx } = req.body;
    const user = await UserModel.findOne({ token });

    if (!user) {
      throw new Error("Can't not find user");
    }
    const now = new Date();

    const rootmodel = {
      author: user._id,
      content,
      refpageidx,
      createdAt: now,
      updatedAt: now,
    };

    const rootComment = new RootCommentModel(rootmodel);
    const data = await rootComment.save();
    return res.send(data);
  } catch (err) {
    return res.status(404).send(err);
  }
});

router.put("/:id", async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const { token } = req.headers;
    const { author, content, refpageidx } = req.body;
    const getcomment = await RootCommentModel.findOne({ _id: id }).populate(
      "author",
    );

    if (getcomment != null) {
      if (getcomment.author.token === token) {
        const now = new Date();
        const rootmodel = {
          author,
          refpageidx,
          content,
          updatedAt: now,
        };
        const data = await getcomment.update(rootmodel);
        await getcomment.save();
        return res.send(data);
      }
    }
  } catch (err) {
    return res.status(404).send(err);
  }
});

router.delete("/:id", async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const { token } = req.headers;
    const getcomment = await RootCommentModel.findOne({ _id: id }).populate(
      "author",
    );
    if (getcomment != null) {
      if (getcomment.author.token === token) {
        // await RootCommentModel.remove({ _id: id });
        await getcomment.remove();
        return res.send(getcomment);
      }
    }
  } catch (err) {
    return res.status(404).send(err);
  }
});

// router.put("/:id/like", async (req: express.Request, res: express.Response) => {
//   try {
//     const { id } = req.params;
//     const { token } = req.headers;
//     const user = await UserModel.findOne({ token });
//     const getcomment = await RootCommentModel.findOne({ _id: id }).populate(
//       "author",
//     );
//     if (getcomment && user) {
//       getcomment.comments.
//       getcomment.update({ likes: getcomment.likes.concat(user._id) });
//     }
//   } catch (err) {
//     return res.status(404).send(err);
//   }
// });

export default router;
