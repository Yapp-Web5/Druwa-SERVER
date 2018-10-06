import { Schema, Document, model } from "mongoose";
import { User, UserSchema } from "./UserModel";

export interface Comment extends Document {
  rootcomment_id: string;
  author: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export const CommentSchema = new Schema({
  rootcomment_id:{
    type: String,
    required: true,
    index: true,
  },
  author: {
    type: String,
    required: true,
    index: true,
  },
  content:{
    type: String,
    index: true,
  },
  createdAt:{
      type: Date,
      index: true,
  },
  updatedAt: {
      type: Date,
      index: true,
  },
});


export const CommentModel = model<Comment>("Comment", CommentSchema);
