import {
  getConversations,
  getConversationById,
  conversationInitiateServive,
  getConversationChatSearch,
} from "../services/ConversationServices.js";
import { sendErrorResponse, sendSuccessResponse } from "../common/Response.js";

export const getAllConversationCntrlr = async (req, res) => {
  try {
    const sourceBy = req.user.managedBy;
    const searchQuery = req.query.search?.trim() || "";
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const options = { page: searchQuery ? 1 : page, limit };

    const {
      conversationsWithText,
      totalConversations,
      totalPages,
      currentPage,
    } = await getConversations(sourceBy, searchQuery, options);

    const { searchChat } = await getConversationChatSearch(
      sourceBy,
      searchQuery
    );

    const responseData = [...conversationsWithText, ...searchChat];

    return sendSuccessResponse(
      res,
      "Conversations fetched successfully",
      {
        conversations: responseData,
        pagination: {
          totalConversations,
          totalConversationPages: totalPages,
          currentConversationPage: currentPage,
          ConversationLimit: limit,
        },
      },
      200
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
      Conversation,
      200
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
      conversationData,
      200
    );
  } catch (error) {
    return await sendErrorResponse(
      res,
      error.statusCode || 500,
      error.message || "Internal Server Error"
    );
  }
};
