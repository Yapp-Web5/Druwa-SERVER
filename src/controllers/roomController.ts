import express from "express";
import { Room, RoomModel } from "../models/RoomModel";

const router = express.Router();

router.post("/", async (req: express.Request, res: express.Response) => {
  try {
    const room = new RoomModel();
    const result = room.save();
    return res.send(result);
  } catch (err) {
    return res.status(500).send(err);
  }
});

export default router;
