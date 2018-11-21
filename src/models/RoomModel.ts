import { Schema, Document, model } from "mongoose";
import { User } from "./UserModel";
import { Card } from "./CardModel";

export interface Room extends Document {
  url: string;
  lecturer: string;
  title: string;
  description: string;
  admins: User[];
  isPublic: boolean;
  maxParticipants: number;
  participants: User[];
  createdAt: Date;
  pdfPath: string;
  cards: Card[];
  password?: string;
}

export const RoomSchema = new Schema({
  url: {
    type: String,
    required: false,
    unique: true,
    index: true,
  },
  lecturer: {
    type: String,
    required: true,
    index: true,
  },
  title: {
    type: String,
    required: true,
    index: true,
  },
  description: {
    type: String,
    default: "",
    index: true,
  },
  admins: [
    {
      type: Schema.Types.ObjectId,
      ref: "user",
      require: true,
    },
  ],
  isPublic: {
    type: Boolean,
    required: true,
    index: true,
  },
  maxParticipants: {
    type: Number,
    required: true,
    default: 100,
    index: true,
  },
  participants: [
    {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  ],
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
    index: true,
  },
  pdfPath: {
    type: String,
    required: false,
    unique: true,
    index: true,
  },
  cards: [
    {
      type: Schema.Types.ObjectId,
      ref: "card",
    },
  ],
  password: {
    type: String,
    index: true,
  },
});

export const RoomModel = model<Room>("room", RoomSchema);
