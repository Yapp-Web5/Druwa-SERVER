import { Schema, Document, model } from "mongoose";

import { User, UserSchema } from "./UserModel";
import { RootCommentSchema } from "./RootCommentModel";

export interface Room extends Document {
  url: string;
  lecturer: string;
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
    required: false,
    unique: true,
    index: true
  },
  lecturer: {
    type: String,
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    index: true
  },
  description: {
    type: String,
    default: "",
    index: true
  },
  admins: [
    {
      type: Schema.Types.ObjectId,
      ref: "user",
      require: true
    }
  ],

  isPublic: {
    type: Boolean,
    required: true,
    index: true
  },
  password: {
    type: String,
    index: true
  },
  maxParticipants: {
    type: Number,
    required: true,
    default: 100,
    index: true
  },
  participants: [
    {
      type: Schema.Types.ObjectId,
      ref: "user"
    }
  ],
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
    index: true
  },
  comments: [RootCommentSchema]
});

export const RoomModel = model<Room>("room", RoomSchema);
