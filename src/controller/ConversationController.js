import {
  getAllConversations,
  getConversationById,
  conversationInitiateServive,
} from "../services/ConversationServices.js";
import { sendErrorResponse, sendSuccessResponse } from "../common/Response.js";

export const getAllConversationCntrlr = async (req, res) => {
  try {
    const sourceBy = req.user.managedBy;
    const Conversations = await getAllConversations(sourceBy);
    if (Conversations && Conversations.length <= 0) {
      return sendErrorResponse(res, 404, "conversation not found!!");
    }
    return sendSuccessResponse(
      res,
      "conversation fetch successfully",
      Conversations
    );
  } catch (error) {
    return await sendErrorResponse(
      res,
      error.statusCode || 500,
      error.message || "Internal Server Error"
    );
  }
};

export const getConversationByIdCntrlr = async (req, res) => {
  try {
    const ConversationId = req.params.id;
    const Conversation = await getConversationById(ConversationId);
    if (!Conversation) {
      return sendErrorResponse(res, 404, "conversation not found!!");
    }
    return sendSuccessResponse(
      res,
      "conversation fetch successfully",
      Conversation
    );
  } catch (error) {
    console.error("Error fetching Conversation:", error.message);
    return await sendErrorResponse(
      res,
      error.statusCode || 500,
      error.message || "Internal Server Error"
    );
  }
};

export const conversationInitiateCntrlr = async (req, res) => {
  try {
    const sourceBy = req.user.managedBy;
    const data = req.body;
    const userId = req.user._id;
    const conversationData = await conversationInitiateServive({
      ...data,
      sourceBy,
      userId,
    });
    return await sendSuccessResponse(
      res,
      "conversation Initiate successfully",
      conversationData
    );
  } catch (error) {
    return await sendErrorResponse(
      res,
      error.statusCode || 500,
      error.message || "Internal Server Error"
    );
  }
};
