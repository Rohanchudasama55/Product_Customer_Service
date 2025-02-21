import mongoose from "mongoose";

const templateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
    default: "en-US",
  },
  category: {
    type: String,
    enum: ["MARKETING", "AUTHENTICATION", "UTILITY"],
    default: "MARKETING",
  },
  variables: [
    {
      type: String,
    },
  ],
  components: [
    {
      type: {
        type: String,
        enum: ["HEADER", "BODY", "FOOTER", "BUTTONS"],
        required: true,
      },
      format: {
        type: String,
        enum: ["TEXT", "IMAGE", "VIDEO", "DOCUMENT", "LOCATION"],
      },
      text: {
        type: String,
      },
      example: {
        type: mongoose.Schema.Types.Mixed, // Allows flexible object structure
        default: {},
      },
      // url:{
      //   type: String, ----------> image,video,document
      // },
      buttons: {
        type: [
          {
            type: {
              type: String,
              enum: ["QUICK_REPLY", "URL", "PHONE_NUMBER", "CUSTOM"],
              required: true,
            },
            text: {
              type: String,
            },
            url: {
              type: String,
            },
            phone_number: {
              type: String,
            },
          },
        ],
        default: undefined,
      },
    },
  ],
});

// Custom toJSON method to remove __v
templateSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model("Templates", templateSchema);
