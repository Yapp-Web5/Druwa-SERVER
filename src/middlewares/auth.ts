import express from "express";
import { UserModel } from "../models/UserModel";

export async function checkAuth(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    const token = req.headers.token;
    if (!token) {
      throw new Error("Can not find token in your request.");
    }
    const user = await UserModel.findOne({ token });
    if (!user) {
      throw new Error("Can not find user related to the token.");
    }
    return next();
  } catch (err) {
    return res.status(401).send(err.data || { message: err.toString() });
  }
}
