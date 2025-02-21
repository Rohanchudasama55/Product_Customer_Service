import mongoose from "mongoose";

const textSchema = new mongoose.Schema(
  {
    text: {
      type: String,
    },
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Conversation",
    },
    to: {
      type: Number,
      required: true,
    },
    from: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
    },
    url: {
      type: String,
    },
    IsIncoming: {
      type: Boolean,
      required: true,
      default: false,
    },
    textId: {
      type: String,
    },
    status: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Text", textSchema);
