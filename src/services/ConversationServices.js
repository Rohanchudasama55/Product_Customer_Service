import ConversationModel from "../model/ConversationModel.js";
import DatabaseHelper from "../common/DatabaseHelper.js";
import mongoose from "mongoose";
import TemplateModel from "../model/TemplateModel.js";
import contactModel from "../model/ContactModel.js";
import TextModel from "../model/TextModel.js";

const getConversationPipeline = (sourceBy, searchQuery) => {
  const matchConditions = {};

  if (searchQuery) {
    matchConditions["$or"] = [
      { "receiverData.email": { $regex: new RegExp(searchQuery, "i") } },
      { "receiverData.name": { $regex: new RegExp(searchQuery, "i") } },
      {
        "receiverData.phoneNumber": { $regex: new RegExp(searchQuery, "i") },
      },
    ];
  }

  return [
    { $match: { isDeleted: false, sourceBy } },
    {
      $lookup: {
        from: "contacts",
        localField: "receiverId",
        foreignField: "_id",
        as: "receiverData",
      },
    },
    {
      $addFields: {
        lastTextIdStr: { $toString: "$lastTextId" },
        isValidLastTextId: {
          $cond: {
            if: { $eq: [{ $strLenCP: { $toString: "$lastTextId" } }, 24] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $lookup: {
        from: "texts",
        let: {
          lastTextId: {
            $cond: [
              { $eq: ["$isValidLastTextId", true] },
              { $toObjectId: "$lastTextIdStr" },
              null,
            ],
          },
        },
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$lastTextId"] } } },
          {
            $project: {
              _id: 1,
              text: 1,
              conversationId: 1,
              to: 1,
              from: 1,
              type: 1,
              IsIncoming: 1,
              textId: 1,
              status: 1,
              createdAt: 1,
              updatedAt: 1,
            },
          },
        ],
        as: "lastText",
      },
    },
    {
      $project: {
        _id: 1,
        senderId: 1,
        isDeleted: 1,
        lastTextId: 1,
        unreadCount: 1,
        createdAt: 1,
        updatedAt: 1,
        receiverData: {
          $cond: {
            if: { $eq: [{ $size: "$receiverData" }, 1] },
            then: {
              _id: { $arrayElemAt: ["$receiverData._id", 0] },
              name: { $arrayElemAt: ["$receiverData.name", 0] },
              email: { $arrayElemAt: ["$receiverData.email", 0] },
              phoneNumber: { $arrayElemAt: ["$receiverData.phoneNumber", 0] },
            },
            else: "$receiverData",
          },
        },
        lastText: { $arrayElemAt: ["$lastText", 0] },
      },
    },
    { $match: matchConditions },
    { $sort: { updatedAt: -1 } },
  ];
};

export const getConversations = async (sourceBy, searchQuery, options) => {
  try {
    const { page, limit } = options;
    const skip = (page - 1) * limit;
    const pipeline = getConversationPipeline(sourceBy, searchQuery);

    const conversationsWithText = await ConversationModel.aggregate([
      ...pipeline,
      { $skip: skip },
      { $limit: limit },
    ]);

    const totalConversations = await ConversationModel.countDocuments({
      isDeleted: false,
      sourceBy,
    });

    return {
      conversationsWithText,
      totalConversations,
      totalPages: Math.ceil(totalConversations / limit),
      currentPage: page,
    };
  } catch (error) {
    throw {
      statusCode: error.statusCode || 500,
      message: error.message || "Error in fetch conversation service",
      error,
    };
  }
};

export const getConversationChatSearch = async (sourceBy, searchQuery) => {
  try {
    const pipeline = getConversationPipeline(sourceBy);
    const conversationsWithTexts = await ConversationModel.aggregate(pipeline);
    const conversationIds = conversationsWithTexts.map(
      (conversation) => conversation._id
    );

    if (!conversationIds.length || !searchQuery) return { searchChat: [] };

    // Fetch matching text records
    const textMatches = await TextModel.aggregate([
      {
        $match: {
          conversationId: { $in: conversationIds },
          text: { $regex: new RegExp(searchQuery, "i") },
        },
      },
      {
        $lookup: {
          from: "conversations",
          localField: "conversationId",
          foreignField: "_id",
          as: "conversationData",
        },
      },
      {
        $unwind: "$conversationData", // To access conversation data
      },
      {
        $project: {
          _id: 1,
          text: 1,
          conversationId: 1,
          createdAt: 1,
          updatedAt: 1,
          conversationData: 1, // Include full conversation data
        },
      },
    ]);

    return {
      searchChat: textMatches,
    };
  } catch (error) {
    throw {
      statusCode: error.statusCode || 500,
      message: error.message || "Error in fetch conversation service",
      error,
    };
  }
};

export const getConversationById = async (ConversationId) => {
  try {
    console.log("API call for getConversationById", ConversationId);
    try {
      const conversationData = await DatabaseHelper.getRecordByIdFilter(
        ConversationModel,
        ConversationId,
        { unreadCount: { $gt: 0 } }
      );

      if (conversationData && conversationData._id) {
        const updateConversation = await DatabaseHelper.updateRecordById(
          ConversationModel,
          ConversationId,
          {
            unreadCount: 0,
          }
        );
      }
    } catch (error) {
      console.log("error", error);
      console.error(
        `Error updating conversation for ${ConversationId}:`,
        error
      );
      throw {
        statusCode: error.statusCode || 500,
        message: error.message || "Internal Server Error",
      };
    }

    let conversation = await ConversationModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(ConversationId),
          isDeleted: false,
        },
      },
      {
        $lookup: {
          from: "contacts",
          localField: "receiverId",
          foreignField: "_id",
          as: "receiverData",
        },
      },
      {
        $lookup: {
          from: "texts",
          let: { conversationId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$conversationId", "$$conversationId"] },
              },
            },
            { $sort: { createdAt: -1 } },
            {
              $project: {
                textId: 1,
                conversationId: 1,
                to: 1,
                from: 1,
                type: 1,
                IsIncoming: 1,
                url: 1,
                createdAt: 1,
                updatedAt: 1,
                status: 1,
                text: {
                  $cond: {
                    if: { $eq: ["$type", "template"] },
                    then: "$text",
                    else: {
                      $cond: {
                        if: { $in: ["$type", ["image", "video", "document"]] },
                        then: "$url",
                        else: "$text",
                      },
                    },
                  },
                },
              },
            },
          ],
          as: "textData",
        },
      },
      {
        $project: {
          _id: 1,
          senderId: 1,
          isDeleted: 1,
          lastTextId: 1,
          createdAt: 1,
          updatedAt: 1,
          receiverData: {
            $cond: {
              if: { $eq: [{ $size: "$receiverData" }, 1] },
              then: {
                _id: { $arrayElemAt: ["$receiverData._id", 0] },
                name: { $arrayElemAt: ["$receiverData.name", 0] },
                email: { $arrayElemAt: ["$receiverData.email", 0] },
                phoneNumber: { $arrayElemAt: ["$receiverData.phoneNumber", 0] },
              },
              else: "$receiverData",
            },
          },
          textData: "$textData",
        },
      },
    ]);

    if (!conversation.length) {
      throw { statusCode: 404, message: "Conversation not found" };
    }

    conversation = conversation[0];

    for (let i = 0; i < conversation.textData.length; i++) {
      const textItem = conversation.textData[i];
      if (
        textItem.type === "template" &&
        mongoose.Types.ObjectId.isValid(textItem.text)
      ) {
        try {
          const template = await TemplateModel.findById(textItem.text);
          conversation.textData[i].text = template
            ? template
            : "Template not found";
        } catch (error) {
          console.error(
            `Error fetching template for textId: ${textItem.text}`,
            error
          );
          conversation.textData[i].text = "Error fetching template data";
        }
      }
    }

    return conversation;
  } catch (error) {
    console.error("Error in getConversationById:", error);
    throw {
      statusCode: error.statusCode || 500,
      message: error.message || "Error in fetching conversation data",
      error,
    };
  }
};

export const conversationInitiateServive = async (data) => {
  try {
    const { phoneNumber, sourceBy, userId } = data;
    let contact = await DatabaseHelper.getRecords(
      contactModel,
      { phoneNumber, sourceBy },
      {}
    );
    contact = contact?.data;
    contact = contact[0];
    if (!contact || contact.length === 0) {
      contact = await DatabaseHelper.createRecord(contactModel, {
        phoneNumber,
        sourceBy,
      });
    }

    let conversation;
    conversation = await DatabaseHelper.getRecords(ConversationModel, {
      receiverId: contact._id,
    });
    conversation = conversation?.data;
    conversation = conversation[0];
    if (!conversation || conversation.length === 0) {
      conversation = await DatabaseHelper.createRecord(ConversationModel, {
        receiverId: contact._id,
        sourceBy,
        senderId: userId,
        unreadCount: 0,
        lastTextId: "00000000",
      });
    }
    return conversation._id;
  } catch (error) {
    console.error("Error in conversationInitiate:", error);
    throw {
      statusCode: error.statusCode || 500,
      message: error.message || "Error in conversationInitiate",
      error,
    };
  }
};
