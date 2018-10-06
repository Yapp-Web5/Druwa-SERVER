import express from "express";

import roomController from "./controllers/roomController";
import userController from "./controllers/userController";
import testController from "./controllers/testController";
import commentController from "./controllers/commentController";

const router = express.Router();

router.use("/rooms", roomController);
router.use("/users", userController);
router.use("/test", testController);
router.use("/comment", commentController);

export default router;
