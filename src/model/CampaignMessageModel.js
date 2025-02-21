import mongoose from "mongoose";

const campaignMesaageSchema = new mongoose.Schema(
  {
    template_name: {
      type: String,
      required: true,
    },
    contactId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contact",
      required: false,
    },
    status: {
      type: String,
    },
    textId: {
      type: String,
    },
    campaignId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "campaign",
    },
  },
  {
    timestamps: true,
  }
);

// Custom toJSON method to remove __v
campaignMesaageSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model("CampaignMesaage", campaignMesaageSchema);
