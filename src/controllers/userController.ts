import express from "express";
import { User, UserModel } from "../models/UserModel";

const router = express.Router();

router.post("/", async (req: express.Request, res: express.Response) => {
  try {
    const { username, email } = req.body;
    const userObject = {
      username: username as string,
      email: email as string,
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
