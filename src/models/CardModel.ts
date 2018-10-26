import { UserSchema, User } from "./UserModel";
import { Like, LikeSchema } from "./LikeModel";
import { Schema, Document, model, Mongoose } from "mongoose";
import { CommentSchema, Comment } from "./CommentModel";

export interface Card extends Document {
  author: User;
  content: string;
  refpageidx: number;
  likes: User[];
  comments: Comment[];
  createdAt: Date;
  updatedAt: Date;
}

export const CardSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: "user",
    index: true,
    required: true,
  },
  content: {
    type: String,
    index: true,
    required: true,
  },
  refpageidx: {
    type: Number,
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
});

export const CardModel = model<Card>("card", CardSchema);
