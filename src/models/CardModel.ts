import { User } from "./UserModel";
import { Schema, Document, model } from "mongoose";
import { Comment } from "./CommentModel";

export interface Card extends Document {
  author: User;
  roomUrl: string;
  content: string;
  likes: User[];
  comments: Comment[];
  createdAt: Date;
  updatedAt: Date;
  refPageIdx?: number;
}

export const CardSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: "user",
    index: true,
    required: true,
  },
  roomUrl: {
    type: String,
    index: true,
    required: true,
  },
  content: {
    type: String,
    index: true,
    required: true,
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "comment",
    },
  ],
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "user",
      index: true,
    },
  ],
  createdAt: {
    index: true,
    type: Date,
  },
  updatedAt: {
    index: true,
    type: Date,
  },
  refPageIdx: {
    type: Number,
    index: true,
  },
});

export const CardModel = model<Card>("card", CardSchema);
