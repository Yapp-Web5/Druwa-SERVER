import express from "express";
import { Room, RoomModel } from "../models/RoomModel";
import { UserModel } from "../models/UserModel";

const router = express.Router();

router.post("/", async (req: express.Request, res: express.Response) => {
  try {
    // console.log("TEST");
    // console.log(req.query.id);
    return res.send(req.query);
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.get("/:id", async (req: express.Request, res: express.Response) => {
  try {
    const data = await RoomModel.findOne({ id: req.params.id });
    console.log(data);
    return res.send(data);
  } catch (err) {
    return res.status(404).send(err);
  }
});

export default router;
