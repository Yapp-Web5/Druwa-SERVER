import express, { json } from "express";
import { RootComment, RootCommentModel, RootCommentSchema } from '../models/RootComment'
import { User, UserModel } from "../models/UserModel";
import { Schema } from "mongoose";
import { CommentSchema, Comment, CommentModel } from "../models/CommentModel";

const router = express.Router();


router.get("/", async (req: express.Request, res: express.Response) => {
  try {
    const data = await RootCommentModel.find();
    return res.send(data);
  } catch (err) {
    return res.status(404).send(err);
  }
});


router.get("/:id", async (req: express.Request, res: express.Response) => {
  try {
    const getid = req.params.id;
    const data = await RootCommentModel.findOne({ _id: getid });
    return res.send(data);
  } catch (err) {
    return res.status(404).send(err);
  }
});

router.post("/", async (req: express.Request, res: express.Response) => {

  try {
    const authors = req.headers.token;
    const user = await UserModel.findOne({ token: authors });
    console.log(user);

    const now = new Date();

    const rootmodel = {
      author: authors,
      content: req.body.content,
      refpageidx: req.body.refpageidx,
      createdAt: now,
      updatedAt: now,
    };
    const newrootcomment = new RootCommentModel(rootmodel);

    const data = await newrootcomment.save();

    return res.send(data);
  } catch (err) {
    return res.status(404).send(err);
  }
});


router.put("/:id", async (req: express.Request, res: express.Response) => {

  try {
    const getcomment = await RootCommentModel.findOne({ _id: req.body.id });
    if (getcomment != null) {
      if (getcomment.author === req.headers.token) {
        const now = new Date();

        const rootmodel = {
          author: req.body.author,
          content: req.body.content,
          refpageidx: req.body.refpageidx,
          updatedAt: now,
        };
        const data = await RootCommentModel.find({ _id: req.body.id }).update(rootmodel);
        return res.send(data);
      }
    }

  } catch (err) {
    return res.status(404).send(err);
  }
});

router.delete("/:id", async (req: express.Request, res: express.Response) => {
  try {

    const getcomment = await RootCommentModel.findOne({ _id: req.body.id });
    if (getcomment != null) {
      if (getcomment.author === req.headers.token) {
        await RootCommentModel.remove({ _id: req.body.id });
      }
    }
  } catch (err) {
    return res.status(404).send(err);
  }
});




export default router;