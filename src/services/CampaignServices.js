import DatabaseHelper from "../common/DatabaseHelper.js";
import CampaignMessageModel from "../model/CampaignMessageModel.js";
import CampaignModel from "../model/CampaignModel.js";
import ContactModel from "../model/ContactModel.js";
import ConversationModel from "../model/ConversationModel.js";
import TemplateModel from "../model/TemplateModel.js";
import TextModel from "../model/TextModel.js";
import GroupModel from "../model/GroupModel.js";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const campaignListServices = async (filter, options) => {
  try {
    return await DatabaseHelper.getRecords(CampaignModel, filter, options);
  } catch (error) {
    throw {
      statusCode: error.statusCode || 500,
      message: error.message || "Error in campaignListServices",
      error,
    };
  }
};

export const createCampaignService = async (data) => {
  try {
    const {
      groupId,
      template_name,
      preview_url,
      type,
      language = "en",
      text,
      campaign_name,
      createdBy,
      sourceBy,
    } = data;

    if (!["template", "text", "image", "video", "document"].includes(type)) {
      throw { statusCode: 400, message: "Invalid MessageType" };
    }

    // Fetch template
    const template = await DatabaseHelper.getRecords(TemplateModel, { name: template_name }, {});
    if (!template) throw { statusCode: 404, message: "Template not found" };

    const { variables } = template.data[0];

    // Fetch group and contacts
    const groupData = await GroupModel.findById(groupId).populate("contactIds");
    if (!groupData) throw { statusCode: 404, message: "Group not found" };

    const contacts = groupData.contactIds;
    const totalContacts = contacts.length;

    // Create campaign record
    const campaignData = await DatabaseHelper.createRecord(CampaignModel, {
      campaign_name,
      template_name,
      message_sent: 0,
      message_read: 0,
      message_delivered: 0,
      message_failed: 0,
      total_contact: totalContacts,
      createdBy,
      sourceBy,
    });

    // Prepare message payloads
    const messagePromises = contacts.map(async (contact) => {
      try {
        const componentParameters = variables.map((variable) => ({
          type: "text",
          text:
            variable.toLowerCase() === "name"
              ? contact.name
              : variable.toLowerCase() === "phonenumber"
              ? contact.phoneNumber
              : variable,
        }));

        const payload = {
          messaging_product: "whatsapp",
          type: "template",
          preview_url,
          template: {
            name: template_name,
            language: { code: language },
            components: [{ type: "body", parameters: componentParameters }],
          },
          to: contact.phoneNumber,
        };

        const response = await axios.post(process.env.WHATSAPP_API_URL, payload, {
          headers: {
            Authorization: `Bearer ${process.env.GRAPH_API_TOKEN}`,
            "Content-Type": "application/json",
          },
        });

        const messageId = response.data.messages?.[0]?.id || "00000000";
        const messageStatus = response.data.messages?.[0]?.message_status || "pending";

        // Store message status
        await DatabaseHelper.createRecord(CampaignMessageModel, {
          contactId: contact._id,
          status: messageStatus,
          textId: messageId,
          campaignId: campaignData._id,
          template_name: template_name || "",
        });

        // Fetch or create conversation
        let conversation = await DatabaseHelper.getRecords(ConversationModel, { receiverId: contact._id }, {});
        if (!conversation.data.length) {
          conversation = await DatabaseHelper.createRecord(ConversationModel, {
            receiverId: contact._id,
            senderId: "6763ab37b528bf585f1e6cc8",
            lastTextId: "00000000",
          });
        }

        // Save text record
        const textData = await DatabaseHelper.createRecord(TextModel, {
          to: contact.phoneNumber,
          from: "15551866908",
          text: text?.body || template_name || " ",
          type,
          IsIncoming: false,
          textId: messageId,
          conversationId: conversation._id,
          status: messageStatus,
        });

        // Update conversation lastTextId
        await DatabaseHelper.updateRecordById(ConversationModel, conversation._id, {
          lastTextId: textData._id,
        });

        return { number: contact.phoneNumber, status: "success", data: response.data };
      } catch (error) {
        console.error(`Failed to send message to ${contact.phoneNumber}:`, error.response?.data || error.message);

        await DatabaseHelper.createRecord(CampaignMessageModel, {
          contactId: contact._id,
          status: "failed",
          textId: "00000000",
          campaignId: campaignData._id,
          template_name: template_name || "",
        });

        await DatabaseHelper.updateRecordById(CampaignModel, campaignData._id, {
          $inc: { message_failed: 1 },
          $set: { updatedAt: new Date() },
        });

        return {
          number: contact.phoneNumber,
          status: "failed",
          message: error.message || "Message send failed",
        };
      }
    });

    // Execute all messages in parallel
    const results = await Promise.all(messagePromises);

    return results;
  } catch (error) {
    console.error("Error in createCampaignService:", error);
    throw {
      statusCode: error.statusCode || 500,
      message: error.message || "Internal server error",
      error,
    };
  }
};
