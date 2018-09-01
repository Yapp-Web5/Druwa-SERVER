import { Schema, Document, model } from "mongoose";
import { User, UserSchema } from "./UserModel";
import { RootComment, RootCommentSchema } from "./RootComment";

export interface Like extends Document {
  comments: RootComment;
  user: User;
}

export const LikeSchema = new Schema({
  comments: {
    type: RootCommentSchema,
  },
  user: {
    type: UserSchema,
    required: true,
  },
});


export const LikeModel = model<Like>("Like", LikeSchema);