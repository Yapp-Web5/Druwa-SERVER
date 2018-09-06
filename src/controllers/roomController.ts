import express from "express";
import { Room, RoomModel } from "../models/RoomModel";
import { UserModel } from "../models/UserModel";

const router = express.Router();

router.post("/", async (req: express.Request, res: express.Response) => {
  try {
    const {
      id,
      url,
      title,
      description,
      // admins,
      isPublic,
      password,
      maxParticipants,
      // participants,
      pdfPath,
      // comments,
    } = req.body;
    const roomObject = {
      id: id as number,
      url: url as string,
      title: title as string,
      description: description as string,
      // admins : new UserModel(userObject),
      isPublic: isPublic as boolean,
      password: password as string,
      maxParticipants: maxParticipants as number,
      // participants,
      createdAt: new Date(),
      pdfPath: pdfPath as string,
      // comments
    } as Room;
    const room = new RoomModel(roomObject);
    const result = await room.save();
    return res.send(result);
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
