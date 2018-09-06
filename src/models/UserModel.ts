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
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  email: {
    type: String,
    unique: true,
    required: false,
  },
});

export const UserModel = model<User>("user", UserSchema);
