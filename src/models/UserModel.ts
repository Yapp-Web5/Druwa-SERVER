import { Schema, Document, model } from "mongoose";

export interface User extends Document {
  // id: number;
  token: string;
  username: string;
  createdAt: Date;
  email: string;
  password: string | null;
}

export const UserSchema = new Schema({
  token: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
    index: true,
  },
  email: {
    type: String,
    unique: true,
    required: false,
    index: true,
  },
});

export const UserModel = model<User>("user", UserSchema);
