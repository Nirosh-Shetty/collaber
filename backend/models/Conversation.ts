import { Schema, model, Document } from "mongoose";

export interface IConversation extends Document {
  participants: string[]; // List of user IDs
  lastMessage?: string;   // Cached last message text
  updatedAt: Date;
  createdAt: Date;
}

const ConversationSchema = new Schema<IConversation>(
  {
    participants: {
      type: [String],
      required: true,
      validate: (arr: string[]) => arr.length >= 2, // must have two users minimum
    },

    lastMessage: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Index to quickly find conversations between specific users
ConversationSchema.index({ participants: 1 });

export default model<IConversation>("Conversation", ConversationSchema);
