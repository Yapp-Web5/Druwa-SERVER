import { Schema, Document, model } from "mongoose";

export interface Like extends Document {
  rootcomment_id: string;
  user: string;
}

export const LikeSchema = new Schema({
  rootcomment_id: {
    type: String,
    required: true,
    index: true,
  },
  user: {
    type: String,
    required: true,
    index: true,
  },
});


export const LikeModel = model<Like>("Like", LikeSchema);