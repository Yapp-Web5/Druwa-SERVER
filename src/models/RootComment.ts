import { UserSchema, User } from "./UserModel";
import { Like, LikeSchema } from './LikeModel';
import { Schema, Document, model, Mongoose } from "mongoose";
import { CommentSchema, Comment } from "./CommentModel";

export interface RootComment extends Document {
  author: string;
  content: string;
  refpageidx: number;
  likes: Like[];
  comments: Comment[];
  createdAt: Date;
  updatedAt: Date;
}

export const RootCommentSchema = new Schema({
  author: {
    type: String,
    index: true,
    required: true,
  },
  content: {
    index: true,
    type: String,
  },
  refpageidx: {
    type: Number,
    index: true,
    required: true,
  },
  comments: [{
    type: Schema.Types.ObjectId, 
    ref:'comment',
  }],
  likes:[{
    type: LikeSchema,
  }],
  createdAt: {
    index: true,
    type: Date,
  },
  updatedAt: {
    index: true,
    type: Date,
  },
});

export const RootCommentModel = model<RootComment>(
  "RootComment",
  RootCommentSchema,
);