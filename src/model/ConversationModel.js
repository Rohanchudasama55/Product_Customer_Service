import mongoose from "mongoose";
const conversationSchema = new mongoose.Schema(
  {
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Contact",
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Contact",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    lastTextId: {
      type: mongoose.Schema.Types.Mixed, 
      required: true,
      ref: "Text",
    },
    unreadCount: {
      type: Number,
      default: 0,
    },
    sourceBy:{
        type: String,
        enum:['HRMS','BIOS']
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Conversation", conversationSchema);
