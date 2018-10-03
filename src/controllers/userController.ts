import express from "express";
import * as crypto from "crypto-js";
import { User, UserModel } from "../models/UserModel";
import { generateNickname } from "../consts/nickname";

const router = express.Router();

router.get("/", async (req: express.Request, res: express.Response) => {
  try {
    const token = req.headers.token;
    const data = await UserModel.findOne({ token });
    return res.send(data);
  } catch (err) {
    return res.status(404).send(err);
  }
});

router.post("/", async (req: express.Request, res: express.Response) => {
  try {
    const token = crypto.SHA256(new Date().toString()).toString();
    const userObject = {
      token,
      username: generateNickname(),
      createdAt: new Date(),
    } as User;
    const user = new UserModel(userObject);
    const result = await user.save();
    return res.send(result);
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.post("/:id", async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    await UserModel.findById(id).update({
      _password: req.params.password,
      _userName: req.params.userName,
      _email: req.params.email,
    });

    return res.send(id);
  } catch (err) {
    return res.status(500).send(err);
  }
});

export default router;
