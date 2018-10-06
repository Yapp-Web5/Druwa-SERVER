import express from "express";
import * as _ from "lodash";
import { CursorCommentOptions } from "mongodb";
import { Like, LikeModel } from "../models/LikeModel";
import { RootComment, RootCommentModel } from "../models/RootCommentModel";

const router = express.Router();

// 좋아요 누름
router.post("/", async (req: express.Request, res: express.Response) => {
  try {
    const find_root = await RootCommentModel.findOne({
      _id: req.body.rootcomment_id,
    });
    if (find_root != null) {
      const likeObject = {
        rootcomment_id: req.body.rootcomment_id as string,
        user: req.headers.token as string,
      } as Partial<Like>;

      const like = new LikeModel(likeObject);
      console.log(like);
      const result = await like.save();

      const data = await find_root.update({
        likes: find_root.likes.concat(like),
      });
      await find_root.save();

      return res.send(result);
    }
  } catch (err) {
    return res.status(500).send(err);
  }
});

// 좋아요 취소
router.delete("/:id", async (req: express.Request, res: express.Response) => {
  try {
    const find_root = await RootCommentModel.findOne({ _id: req.params.id });
    if (find_root != null) {
      const getlike = await LikeModel.findOne({ _id: req.params.id });
      if (getlike != null) {
        if (getlike.user === req.headers.token) {
          const result = await getlike.remove();

          const likes = find_root.likes;
          _.remove(likes, item => {
            return item._id.toString() === req.params.id;
          });
          return res.send("Ok");
        } else {
          return res.send("No");
        }
      }
    }
  } catch (err) {
    return res.status(500).send(err);
  }
});

export default router;
