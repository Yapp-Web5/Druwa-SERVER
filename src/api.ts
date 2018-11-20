import express from "express";

import cardController from "./controllers/cardController";
import commentController from "./controllers/commentController";
import roomController from "./controllers/roomController";
import userController from "./controllers/userController";
import uploadController from "./controllers/uploadController";

const router = express.Router();

router.use("/cards", cardController);
router.use("/comments", commentController);
router.use("/rooms", roomController);
router.use("/users", userController);
router.use("/upload", uploadController);

export default router;
