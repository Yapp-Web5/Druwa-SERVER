import express from "express";

import roomController from "./controllers/roomController";
import userController from "./controllers/userController";
import testController from "./controllers/testController";

const router = express.Router();

router.use("/rooms", roomController);
router.use("/users", userController);
router.use("/test", testController);

export default router;
