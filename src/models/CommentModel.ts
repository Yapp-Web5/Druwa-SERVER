import { Schema, Document, model } from "mongoose";
import { RootComment, RootCommentSchema } from "./RootComment";

export interface Comments extends Document {
  comments: RootComment[];
}

export const CommentSchema = new Schema({
  comments: [{
    type: RootCommentSchema
  }],
});

export const RootCommentModel = model<Comments>("Comments", CommentSchema);