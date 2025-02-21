import mongoose from "mongoose";
import Contact from "./ContactModel.js";
const groupSchema = new mongoose.Schema(
  {
    groupName: {
      type: String,
      required: true,
      unique: true,
    },
    contactIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Contact",
      },
    ],
    sourceBy: {
      type: String,
      enum: ["HRMS", "BIOS"],
    },
  },
  {
    timestamps: true,
  }
);

// Custom toJSON method to remove __v
groupSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model("Group", groupSchema);
