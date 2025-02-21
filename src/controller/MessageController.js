import { sendErrorResponse, sendSuccessResponse } from "../common/Response.js";
import {
  sendMessageService,
  getWebhookCallService,
} from "../services/MessageService.js";
import dotenv from "dotenv";
dotenv.config();

export const sendMessageCntrlr = async (req, res) => {
  try {
    const sourceBy = req.user.managedBy;
    const userId = req.user._id;
    const data = req.body;
    if (!data) {
      return sendErrorResponse(res, 400, "Bad Request");
    }
    const result = await sendMessageService({ ...data, sourceBy, userId });
    return sendSuccessResponse(res, "message send succesfully", result);
  } catch (error) {
    return await sendErrorResponse(
      res,
      error.statusCode || 500,
      error.message || "Internal Server Error"
    );
  }
};

export const webhookVerifyCntrlr = async (req, res) => {
  try {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];
    if (mode === "subscribe" && token === process.env.WEBHOOK_VERIFY_TOKEN) {
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      res.status(403).send("Forbidden");
    }
  } catch (error) {
    sendErrorResponse(res, 500, "Failed Webhook Verification", error.message);
  }
};

export const getWebhookCall = async (req, res) => {
  try {
    const data = req.body;
    const webhookResponse = await getWebhookCallService(data);
    sendSuccessResponse(res, "Webhook call succesfully", webhookResponse);
  } catch (error) {
    sendErrorResponse(res, 500, "Failed Webhook Call", error.message);
  }
};
