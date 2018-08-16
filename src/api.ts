import express from "express";

import roomController from "./controllers/roomController";
import userController from "./controllers/userController";

const router = express.Router();

router.use("/room", roomController);
router.use("/user", userController);

export default router;
