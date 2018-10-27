import express from "express";
import * as crypto from "crypto-js";
import { User, UserModel } from "../models/UserModel";
import { generateNickname } from "../consts/nickname";
import { Room } from "../models/RoomModel";

const router = express.Router();

router.get("/", async (req: express.Request, res: express.Response) => {
  try {
    const token = req.headers.token;
    const data = await UserModel.findOne({ token });
    return res.send(data);
  } catch (err) {
    return res.status(404).send({ message: err.toString() });
  }
});

router.post("/", async (req: express.Request, res: express.Response) => {
  try {
    const token = crypto.SHA256(new Date().toString()).toString();
    const userObject = {
      token,
      username: generateNickname(),
      createdAt: new Date(),
      enteredRoom: [],
    };
    const user = new UserModel(userObject);
    const result = await user.save();
    return res.send(result);
  } catch (err) {
    return res.status(500).send(err);
  }
});

export default router;
