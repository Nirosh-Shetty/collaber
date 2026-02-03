import { Schema, model, Document } from "mongoose";

export interface IMessage extends Document {
  conversationId: string;
  senderId: string;
  text?: string;
  mediaUrl?: string;
  mediaType?: "image" | "video" | "file";
  isDeleted: boolean;
  createdAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    conversationId: {
      type: String,
      required: true,
      index: true, // critical for fast message fetch
    },

    senderId: {
      type: String,
      required: true,
    },

    text: {
      type: String,
      trim: true,
    },

    mediaUrl: {
      type: String,
    },

    mediaType: {
      type: String,
      enum: ["image", "video", "file"],
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default model<IMessage>("Message", MessageSchema);
