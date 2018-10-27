import express from "express";

import cardController from "./controllers/cardController";
import commentController from "./controllers/commentController";
import roomController from "./controllers/roomController";
import userController from "./controllers/userController";
import testController from "./controllers/testController";
import likeController from "./controllers/likeController";
import uploadController from "./controllers/uploadController";

const router = express.Router();

router.use("/cards", cardController);
router.use("/comment", commentController);
router.use("/rooms", roomController);
router.use("/users", userController);
router.use("/test", testController);
router.use("/like", likeController);
router.use("/files", uploadController);

export default router;
