import express from "express";

import roomController from "./controllers/roomController";
import userController from "./controllers/userController";
import testController from "./controllers/testController";
import commentController from "./controllers/commentController";
import rootcommentController from "./controllers/rootcommentController";
import likeController from "./controllers/likeController";
import uploadController from "./controllers/uploadController";

const router = express.Router();

router.use("/rooms", roomController);
router.use("/users", userController);
router.use("/test", testController);
router.use("/rootcomment", rootcommentController);
router.use("/comments", commentController);
router.use("/like", likeController);
router.use("/files", uploadController);

export default router;
