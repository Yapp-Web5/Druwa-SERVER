import { User, UserSchema } from "./UserModel";
import { Schema, Document, model } from "mongoose";
import { CommentSchema } from "./CommentModel";

export interface Room extends Document {
  id: number;
  url: string;
  title: string;
  description: string;
  admins: User[];
  isPublic: boolean;
  password: string | null;
  maxParticipants: number;
  participants: User[];
  createAt: Date;
  pdfPath: string;
  comments: Comment[];
}

export const RoomSchema = new Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  url: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
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
  },
  password: {
    type: String,
  },
  maxParticipants: {
    type: Number,
    required: true,
    default: 100,
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
  },
  comments: [{
    type: CommentSchema,
  }],
});

export const RoomModel = model("Room", RoomSchema);
