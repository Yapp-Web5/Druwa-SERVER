import { Schema, Document, model } from "mongoose";
import { User } from "./UserModel";
import { Card } from "./CardModel";

export interface Comment extends Document {
  parentCard: Card;
  author: User;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export const CommentSchema = new Schema({
  parentCard: {
    type: Schema.Types.ObjectId,
    ref: "card",
    required: true,
    index: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
    index: true,
  },
  content: {
    type: String,
    index: true,
  },
  createdAt: {
    type: Date,
    index: true,
  },
  updatedAt: {
    type: Date,
    index: true,
  },
});

export const CommentModel = model<Comment>("comment", CommentSchema);
