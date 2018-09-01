import { UserSchema, User } from "./UserModel"
import { Like, LikeSchema } from "./LikeModel";
import { Schema, Document, model } from "mongoose";

export interface RootComment extends Document {
  author: User;
  content: string
  refpageidx: number;
  likes: Like[];
}

export const RootCommentSchema = new Schema({
  author: {
    type: UserSchema,
    required: true,
  },
  content: {
    type: String,
  },
  refpageidx: {
    type: Number,
    required: true,
  }
});

export const RootCommentModel = model<RootComment>("RootComment", RootCommentSchema);