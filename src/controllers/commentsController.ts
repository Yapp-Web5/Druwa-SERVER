rootcomment
   id
   author
   content
   refpageidx
   likes   

import express from "express";
import * as crypto from "crypto-js";
import { User, UserModel } from "../models/UserModel";

const router = express.Router();

router.get("/:id", async (req: express.Request, res: express.Response) => {
  try {
    console.log(req.params.id);
    const result = await UserModel.find({_id: req.params.id});
    console.log(result);
    return res.send(result);
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.post("/", async (req: express.Request, res: express.Response) => {
  try {
    const { username } = req.body;
    const 
    const token = crypto.SHA256(new Date().toString()).toString();
    const userObject = {
      token,
      username: username as string,
      createdAt: new Date(),
    } as User;
    const user = new UserModel(userObject);
    const result = await user.save();
    return res.send(result);
  } catch (err) {
    return res.status(500).send(err);
  }
});

export default router;
