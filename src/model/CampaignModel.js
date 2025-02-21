import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema(
  {
    campaign_name: {
      type: String,
      required: true,
    },
    template_name: {
      type: String,
    },
    message_delivered: {
      type: Number,
    },
    message_sent: {
      type: Number,
    },
    message_read: {
      type: Number,
    },
    message_failed: {
      type: Number,
    },
    total_contact: {
      type: Number,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    sourceBy: {
      type: String,
      enum: ["HRMS", "BIOS"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Custom toJSON method to remove __v
campaignSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model("campaign", campaignSchema);
