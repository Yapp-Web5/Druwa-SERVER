import { Schema, Document, model } from "mongoose";
import { Room } from "./RoomModel";

export interface User extends Document {
  token: string;
  username: string;
  createdAt: Date;
  email?: string;
  password?: string;
  enteredRoom: Room[];
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
    sparse: true,
  },
  enteredRoom: [
    {
      type: Schema.Types.ObjectId,
      ref: "room",
    },
  ],
});

export const UserModel = model<User>("user", UserSchema);
