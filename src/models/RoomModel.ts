import { Schema, Document, model } from "mongoose";

import { User, UserSchema } from "./UserModel";
import { RootCommentSchema } from "./RootComment";

export interface Room extends Document {
  url: string;
  title: string;
  description: string;
  admins: User[];
  isPublic: boolean;
  password: string | null;
  maxParticipants: number;
  participants: User[];
  createdAt: Date;
  pdfPath: string;
  comments: Comment[];
}

export const RoomSchema = new Schema({
  url: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  title: {
    type: String,
    required: true,
    index: true,
  },
  description: {
    type: String,
    default: "",
    index: true,
  },
  admins: [
    {
      type: UserSchema,
      require: true,
    },
  ],
  isPublic: {
    type: Boolean,
    required: true,
    index: true,
  },
  password: {
    type: String,
    index: true,
  },
  maxParticipants: {
    type: Number,
    required: true,
    default: 100,
    index: true,
  },
  participants: [
    {
      type: UserSchema,
    },
  ],
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
    index: true,
  },
  comments: [
    {
      type: RootCommentSchema,
    },
  ],
});

export const RoomModel = model<Room>("room", RoomSchema);
