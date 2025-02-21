import DatabaseHelper from "../common/DatabaseHelper.js";
import CampaignMessageModel from "../model/CampaignMessageModel.js";
import CampaignModel from "../model/CampaignModel.js";
import ContactModel from "../model/ContactModel.js";
import ConversationModel from "../model/ConversationModel.js";
import TemplateModel from "../model/TemplateModel.js";
import TextModel from "../model/TextModel.js";
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
      to,
      template_name,
      preview_url,
      type,
      language,
      text,
      image,
      campaign_name,
      createdBy,
      sourceBy,
    } = data;
    if (!["template", "text", "image", "video", "document"].includes(type)) {
      throw { statusCode: 400, message: "Invalid MessageType" };
    }

    const template = await DatabaseHelper.getRecords(
      TemplateModel,
      { name: template_name },
      {}
    );
    if (!template || template.length === 0)
      throw { statusCode: 404, message: "Template not found" };

    const selectedTemplate = template[0];
    const variables = selectedTemplate.variables;
    const contacts = await DatabaseHelper.getRecords(
      ContactModel,
      { phoneNumber: { $in: to } },
      {}
    );

    const campaign_data = await DatabaseHelper.createRecord(CampaignModel, {
      campaign_name,
      template_name,
      message_sent: 0,
      message_read: 0,
      message_delivered: 0,
      message_failed: 0,
      total_contact: to.length,
      createdBy,
      sourceBy,
    });

    const results = [];

    for (const number of to) {
      const contact = contacts.find((c) => c.phoneNumber === number);

      if (!contact) {
        results.push({
          number,
          status: "failed",
          message: "Contact does not exist",
        });
        await DatabaseHelper.createRecord(CampaignMessageModel, {
          contactId: null,
          status: "failed",
          textId: "00000000",
          campaignId: campaign_data._id,
          template_name: template_name || "",
        });
        await DatabaseHelper.updateRecordById(
          CampaignModel,
          campaign_data._id,
          {
            $inc: { message_failed: 1 },
            $set: { updatedAt: new Date() },
          }
        );
        continue;
      }

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
          language: { code: language || "en" },
          components: [{ type: "body", parameters: componentParameters }],
        },
        to: number,
      };

      let response;
      try {
        response = await axios.post(process.env.WHATSAPP_API_URL, payload, {
          headers: {
            Authorization: `Bearer ${process.env.GRAPH_API_TOKEN}`,
            "Content-Type": "application/json",
          },
        });
      } catch (error) {
        console.error(
          `Failed to send message to ${number}:`,
          error.response?.data || error.message
        );

        await DatabaseHelper.createRecord(CampaignMessageModel, {
          contactId: contact._id,
          status: "failed",
          textId: "00000000",
          campaignId: campaign_data._id,
          template_name: template_name || "",
        });

        await DatabaseHelper.updateRecordById(
          CampaignModel,
          campaign_data._id,
          {
            $inc: { message_failed: 1 },
            $set: { updatedAt: new Date() },
          }
        );

        results.push({
          number,
          status: "failed",
          message: error.message || "Message send failed",
        });
        continue;
      }

      await DatabaseHelper.createRecord(CampaignMessageModel, {
        contactId: contact._id,
        status: response.data.messages[0]?.message_status || "pending",
        textId: response.data.messages[0]?.id || "00000000",
        campaignId: campaign_data._id,
        template_name: template_name || "",
      });

      let conversation = await DatabaseHelper.getRecords(
        ConversationModel,
        { receiverId: contact._id },
        {}
      );

      if (!conversation || conversation.length === 0) {
        conversation = await DatabaseHelper.createRecord(ConversationModel, {
          receiverId: contact._id,
          senderId: "6763ab37b528bf585f1e6cc8",
          lastTextId: "00000000",
        });
      } else {
        conversation = conversation[0];
      }

      const textPayload = {
        to: number,
        from: "15551866908",
        text: text?.body || template_name || " ",
        type,
        IsIncoming: false,
        textId: response.data.messages[0]?.id,
        conversationId: conversation._id,
        status: response.data.messages[0]?.message_status || "pending",
      };

      try {
        const textData = await DatabaseHelper.createRecord(
          TextModel,
          textPayload
        );
        await DatabaseHelper.updateRecordById(
          ConversationModel,
          conversation._id,
          { lastTextId: textData._id }
        );
      } catch (error) {
        console.error(`Error saving message data for ${number}:`, error);
        results.push({
          number,
          status: "failed",
          message: "Error saving message data",
        });
      }
      results.push({ number, status: "success", data: response.data });
    }

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
