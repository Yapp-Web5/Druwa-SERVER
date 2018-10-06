import express from "express";
import { Room, RoomModel } from "../models/RoomModel";
import { UserModel } from "../models/UserModel";

const router = express.Router();

router.post("/", async (req: express.Request, res: express.Response) => {
  try {
    const { token } = req.headers;
    const user = await UserModel.findOne({ token });
    if (!user) {
      res.status(401).send({ message: "Not found user" });
    }
    console.log(user);
    const {
      lecturer,
      url,
      title,
      description,
      isPublic,
      password,
      maxParticipants,
      pdfPath,
    } = req.body;
    const roomObject = {
      lecturer: lecturer as string,
      url: url as string,
      title: title as string,
      description: description as string,
      admins: [user],
      participants: [user],
      comments: [],
      isPublic: isPublic as boolean,
      password: password as string,
      maxParticipants: maxParticipants as number,
      createdAt: new Date(),
      pdfPath: pdfPath as string,
    } as Partial<Room>;
    const room = new RoomModel(roomObject);
    console.log(room);
    const result = await room.save();

    const getUrl = result.title.charCodeAt(0).toString() + result._id;
    await result.update({ url: getUrl });
    await result.save();

    return res.send(result);
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.get("/:_id", async (req: express.Request, res: express.Response) => {
  try {
    const data = await RoomModel.findOne({ _id: req.params._id });
    console.log(data);
    return res.send(data);
  } catch (err) {
    return res.status(404).send(err);
  }
});

router.put("/:_id", async (req: express.Request, res: express.Response) => {
  try {
    const { token } = req.headers;
    const getUser = await UserModel.findOne({ token });

    if (getUser == null) {
      return res.status(404).send("Not Admin Access!!!!");
    }
    const newData = {
      title: req.body.title,
      lecturer: req.body.lecturer,
      password: req.body.password,
    };

    const result = await RoomModel.findOne(
      {
        _id: req.params._id,
      },
      { admin: "getUser._id" },
    ).update(newData);

    return res.send(result);
  } catch (err) {
    return res.status(404).send(err);
  }
});

router.delete("/:_id", async (req: express.Request, res: express.Response) => {
  try {
    const { token } = req.headers;
    const getUser = await UserModel.findOne({ token });

    if (getUser == null) {
      return res.status(404).send("Not Admin Access!!!!");
    }

    const getAdmin = await RoomModel.findOne(
      { _id: req.params._id },
      { admin: "getUser._id" },
    ).remove();
    return res.send(getAdmin);
  } catch (err) {
    return res.status(400).send(err);
  }
});
export default router;
