import express from "express";

import roomController from "./controllers/roomController";
import userController from "./controllers/userController";

const router = express.Router();

router.use("/rooms", roomController);
router.use("/users", userController);

export default router;
