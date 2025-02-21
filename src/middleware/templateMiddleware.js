import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Buffer } from "buffer";
import { config } from "dotenv";

config(); // Load environment variables

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware to check header type and save image if it's base64
export const IsHeaderType = async (req, res, next) => {
  try {
    const headerComponent = req.body.components?.find(
      (comp) => comp.type === "HEADER"
    );
    const headerType = headerComponent?.format?.toUpperCase();

    if (headerType && headerType !== "TEXT") {
      // Convert Base64 to a Buffer
      const imageBuffer = Buffer.from(headerComponent.image_base64, "base64");

      
      let folderName = "others"; // Default folder
      if (["IMAGE", "VIDEO", "DOCUMENT"].includes(headerType)) {
        folderName = headerType.toLowerCase() + "s"; // e.g., "images", "videos", "documents"
      }

      const uploadDir = path.join(__dirname, `../../uploads/${folderName}`);
      fs.mkdirSync(uploadDir, { recursive: true });

      // Generate Unique File Name
      const fileName = `${headerType.toLowerCase()}_${Date.now()}.jpg`;
      const filePath = path.join(uploadDir, fileName);

      // Save Image Locally
      fs.writeFileSync(filePath, imageBuffer);

      // Generate Public URL (Adjust BASE_URL accordingly)
      const BASE_URL = process.env.SERVER_URL || "http://localhost:3002";
      const fileUrl = `${BASE_URL}/uploads/${folderName}/${fileName}`;

      // Attach URL to Request
      req.body.components[0][headerType].link = fileUrl;
      console.log("req.body>>>>",req.body);
      
    }
    return true;
    // next();
  } catch (error) {
    console.error("Error processing image:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Error processing image",
        error: error.message,
      });
  }
};
