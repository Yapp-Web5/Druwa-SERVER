import express from "express";
import * as _ from "lodash";
import { Comment, CommentModel } from '../models/CommentModel';
import { RootComment, RootCommentModel } from "../models/RootComment";
import { User, UserModel } from "../models/UserModel";
import { CursorCommentOptions } from "mongodb";

const router = express.Router();

//find
router.get("/:rootcomment_id", async (req: express.Request, res: express.Response) => {
  try {
    const data = await CommentModel.findOne({ rootcomment_id: req.params.rootcomment_id });
    console.log(data);
    return res.send(data);
  } catch (err) {
    return res.status(404).send(err);
  }
});

//save
router.post("/", async (req: express.Request, res: express.Response) => {
  try {
    const now = new Date();

    const {
      rootcomment_id,
      content,
    } = req.body;

    const getrootcomment = await RootCommentModel.findOne({_id: rootcomment_id});

    if(getrootcomment != null){

      const commentObject = {
        rootcomment_id: rootcomment_id as string,
        author: req.headers.token as string,
        content: content as string,
        createdAt: now,
        updatedAt: now,
      } as Partial<Comment>;

      const comment = new CommentModel(commentObject);
      console.log(comment);
  
      const result = await comment.save();
      
      const data = await getrootcomment.update({comments: getrootcomment.comments.concat(comment)});
      await getrootcomment.save();
      console.log(data);
      return res.send(result);
    }else{
      return res.send("failed");
    }

  } catch (err) {
    return res.status(500).send(err);
  }
});


//update
router.put("/", async (req: express.Request, res: express.Response) => {
  try {
    const {
      rootcomment_id,
      content,
    } = req.body;

    const getrootcomment = await RootCommentModel.find({rootcomment_id: req.params.rootcomment_id});
    if(getrootcomment != null){
      const commentObject = {
        rootcomment_id: rootcomment_id as string,
        author: req.headers.token as string,
        content: content as string,
        updatedAt : new Date(),
      } as Partial<Comment>;
  
      const getcomment = await CommentModel.findOne({rootcomment_id: req.body.rootcomment_id});

      if(getcomment != null){
        if (getcomment.author === req.headers.token){
          const result = await getcomment.update(commentObject);
          return res.send(result);
        }
      }
    }else{
      return res.send("no");
    }
   
  } catch (err) {
    return res.status(500).send(err);
  }
});

//delete
router.delete("/:comment_id", async (req: express.Request, res: express.Response) => {
  try {

    const comment = await CommentModel.findOne({_id: req.params.comment_id });
    if (comment) {
      const rootComment = await RootCommentModel.findOne({_id: comment.rootcomment_id });
      if (rootComment) {
        const comments = rootComment.comments;
        _.remove(comments, (item) => {
          return item._id.toString() === req.params.comment_id     
        });

        await rootComment.update({ comments });
        await comment.remove();
        return res.send(comments);
      }
    }

  } catch (err) {
    return res.status(500).send(err);
  }
});


export default router;
