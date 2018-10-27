import express from "express";
import { UserModel } from "../models/UserModel";

const ERROR = {
  NO_TOKEN: {
    status: 401,
    message: "Can not find token in your request.",
  },
  INVALID_TOKEN: {
    status: 404,
    message: "Invalid user token",
  },
};

export async function checkAuth(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    const token = req.headers.token;
    if (!token) {
      throw ERROR.NO_TOKEN;
    }
    const user = await UserModel.findOne({ token }, { password: 0 });
    if (!user) {
      throw ERROR.INVALID_TOKEN;
    }
    res.locals.user = user;
    return next();
  } catch (err) {
    return res
      .status(err.status || 500)
      .send({ message: err.message || err.toString() });
  }
}
