import express from "express";
import { User, UserModel } from "../models/UserModel";

const router = express.Router();

router.post("/", async (req: express.Request, res: express.Response) => {
  try {
    const user = new UserModel();
    const result = user.save();
    return res.send(result);
  } catch (err) {
    return res.status(500).send(err);
  }
});

export default router;
