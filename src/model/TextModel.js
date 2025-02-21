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

// Custom toJSON method to remove __v
textSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model("Text", textSchema);
