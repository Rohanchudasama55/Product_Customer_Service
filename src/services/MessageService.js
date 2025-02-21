import DatabaseHelper from "../common/DatabaseHelper.js";
import CampaignMessageModel from "../model/CampaignMessageModel.js";
import CampaignModel from "../model/CampaignModel.js";
import ContactModel from "../model/ContactModel.js";
import ConversationModel from "../model/ConversationModel.js";
import TextModel from "../model/TextModel.js";
import TemplateModel from "../model/TemplateModel.js";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
import { io } from "../config/socket.js";

//   try {
//     const {
//       to,
//       template_name,
//       components,
//       preview_url,
//       type,
//       language,
//       text,
//       image,
//       sourceBy
//     } = data;

//     if (!["template", "text", "image", "video", "document"].includes(type)) {
//       throw { statusCode: 400, message: "Invalid MessageType" };
//     }

//     const payload = {
//       messaging_product: "whatsapp",
//       type,
//       preview_url,
//       ...(type === "template" && {
//         template: {
//           name: template_name,
//           language: { code: language || "en" },
//           components: components || [],
//         },
//       }),
//       ...(type === "text" && { text: { body: text?.body } }),
//       ...(type === "image" && { image: { link: image?.link } }),
//     };

//     const results = [];

//     for (const number of to) {
//       try {
//         let contact = await DatabaseHelper.getRecords(
//           ContactModel,
//           { phoneNumber: number },
//           {}
//         );

//         if (!contact || contact.length === 0) {
//           results.push({
//             number,
//             status: "failed",
//             message: "Contact does not exist",
//           });
//           continue;
//         }
//         let componentParameters
//         contact = contact[0];
//         if(type === "template"){
//           const template = await DatabaseHelper.getRecords(TemplateModel, { name: template_name }, {});
//           const selectedTemplate = template[0];
//           const variables = selectedTemplate.variables;

//            componentParameters = variables.map((variable) => ({
//             type: "text",
//             text: variable.toLowerCase() === "name" ? contact.name : variable.toLowerCase() === "phonenumber" ? contact.phoneNumber : variable,
//           }));
//           console.log("componentParameters",componentParameters);
//           payload.template.components = componentParameters || []
//         }
//         const currentPayload = { ...payload, to: number };

//         let response;
//         try {
//           response = await axios.post(
//             process.env.WHATSAPP_API_URL,
//             currentPayload,
//             {
//               headers: {
//                 Authorization: `Bearer ${process.env.GRAPH_API_TOKEN}`,
//                 "Content-Type": "application/json",
//               },
//             }
//           );

//           if (!response?.data) {
//             throw new Error("No response from WhatsApp API");
//           }
//         } catch (error) {
//           console.log("response.data",error.response.data,97);
//           console.error(`WhatsApp API error for ${number}:`, error.response);
//           results.push({
//             number,
//             status: "failed",
//             message: "Failed to send message",
//           });
//           continue;
//         }

//         let conversation;
//         try {
//           conversation = await DatabaseHelper.getRecords(
//             ConversationModel,
//             { receiverId: contact._id },
//             {}
//           );

//           if (!conversation || conversation.length === 0) {
//             conversation = await DatabaseHelper.createRecord(
//               ConversationModel,
//               {
//                 receiverId: contact._id,
//                 senderId: req.user._id,
//                 lastTextId: "00000000",
//                 sourceBy,
//                 updatedAt: new Date()
//               }
//             );
//           } else {
//             conversation = conversation[0];
//           }
//         } catch (error) {
//           console.error(
//             `Database error when fetching conversation for ${number}:`,
//             error
//           );
//           results.push({
//             number,
//             status: "failed",
//             message: "Database error fetching conversation",
//           });
//           continue;
//         }

//         const textPayload = {
//           to: number,
//           from: "15551866908",
//           text: text?.body || " ",
//           type,
//           IsIncoming: false,
//           textId: response.data.messages[0]?.id,
//           conversationId: conversation._id,
//           status: response.data.messages[0]?.message_status || "pending",
//         };

//         let textData;
//         try {
//           textData = await DatabaseHelper.createRecord(
//             TextModel,
//             textPayload,
//             {}
//           );
//         } catch (error) {
//           console.error(`Error saving message data for ${number}:`, error);
//           results.push({
//             number,
//             status: "failed",
//             message: "Error saving message data",
//           });
//           continue;
//         }

//         try {
//           await DatabaseHelper.updateRecordById(
//             ConversationModel,
//             conversation._id,
//             {
//               lastTextId: textData._id,
//               updatedAt: new Date()
//             }
//           );
//         } catch (error) {
//           console.error(`Error updating conversation for ${number}:`, error);
//         }

//         results.push({ number, status: "success", data: response.data });
//       } catch (error) {
//         console.error(`Error processing number ${number}:`, error);
//         results.push({
//           number,
//           status: "failed",
//           message: error.message || "Unexpected error",
//         });
//       }
//     }
//     console.log("Final Data:", results);
//     return results;
//   } catch (error) {
//     console.error("Error in sendMessageService:", error);
//     throw { statusCode: error.statusCode || 500, message: error.message || "Internal server error", error };
//   }
// };

// import axios from "axios";
// import DatabaseHelper from "../helpers/DatabaseHelper.js";
// import ContactModel from "../models/ContactModel.js";
// import TemplateModel from "../models/TemplateModel.js";
// import ConversationModel from "../models/ConversationModel.js";
// import TextModel from "../models/TextModel.js";

export const sendMessageService = async (data) => {
  try {
    const {
      to,
      template_name,
      preview_url,
      type,
      language = "en_US",
      text,
      image,
      sourceBy,
      userId,
    } = data;

    if (!["template", "text", "image", "video", "document"].includes(type)) {
      throw { statusCode: 400, message: "Invalid MessageType" };
    }

    const results = [];

    for (const number of to) {
      try {
        let contact = await DatabaseHelper.getRecords(
          ContactModel,
          { phoneNumber: number },
          {}
        );
        if (!contact?.length) {
          results.push({
            number,
            status: "failed",
            message: "Contact does not exist",
          });
          continue;
        }
        contact = contact[0];

        let payload = {
          messaging_product: "whatsapp",
          type,
          preview_url,
          ...(type === "text" && { text: { body: text?.body || " " } }),
          ...(type === "image" && { image: { link: image?.link } }),
        };

        let template;
        if (type === "template" && template_name) {
          template = await DatabaseHelper.getRecords(
            TemplateModel,
            { name: template_name },
            {}
          );
          if (!template?.length) {
            results.push({
              number,
              status: "failed",
              message: "Template not found",
            });
            continue;
          }
          const selectedTemplate = template[0];
          const variables = selectedTemplate.variables || [];

          const componentParameters = variables.map((variable) => ({
            type: "text",
            text:
              variable.toLowerCase() === "name"
                ? contact.name
                : variable.toLowerCase() === "phonenumber"
                ? contact.phoneNumber
                : variable,
          }));

          payload.template = {
            name: template_name,
            language: { code: language },
            components: [{ type: "body", parameters: componentParameters }],
          };
        }

        let response;
        try {
          response = await axios.post(
            process.env.WHATSAPP_API_URL,
            { ...payload, to: number },
            {
              headers: {
                Authorization: `Bearer ${process.env.GRAPH_API_TOKEN}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (!response?.data) throw new Error("No response from WhatsApp API");
        } catch (error) {
          console.error(
            `WhatsApp API error for ${number}:`,
            error?.response?.data || error.message
          );
          results.push({
            number,
            status: "failed",
            message: "Failed to send message",
          });
          continue;
        }

        let conversation = await DatabaseHelper.getRecords(
          ConversationModel,
          { receiverId: contact._id },
          {}
        );
        if (!conversation?.length) {
          conversation = await DatabaseHelper.createRecord(ConversationModel, {
            receiverId: contact._id,
            senderId: userId || "defaultUserId",
            lastTextId: "00000000",
            sourceBy,
            updatedAt: new Date(),
          });
        } else {
          conversation = conversation[0];
        }

        const textPayload = {
          to: number,
          from: "15551866908",
          text: text?.body || template[0]._id,
          type,
          IsIncoming: false,
          textId: response.data.messages[0]?.id,
          conversationId: conversation._id,
          status: response.data.messages[0]?.message_status || "pending",
        };

        let textData;
        try {
          textData = await DatabaseHelper.createRecord(
            TextModel,
            textPayload,
            {}
          );
        } catch (error) {
          console.error(`Error saving message data for ${number}:`, error);
          results.push({
            number,
            status: "failed",
            message: "Error saving message data",
          });
          continue;
        }

        try {
          await DatabaseHelper.updateRecordById(
            ConversationModel,
            conversation._id,
            {
              lastTextId: textData._id,
              updatedAt: new Date(),
            }
          );
        } catch (error) {
          console.error(`Error updating conversation for ${number}:`, error);
        }

        results.push({ number, status: "success", data: response.data });
      } catch (error) {
        console.error(`Error processing number ${number}:`, error);
        results.push({
          number,
          status: "failed",
          message: error.message || "Unexpected error",
        });
      }
    }

    console.log("Final Data:", results);
    return results;
  } catch (error) {
    console.error("Error in sendMessageService:", error);
    throw {
      statusCode: error.statusCode || 500,
      message: error.message || "Internal server error",
      details: error,
    };
  }
};

export const getWebhookCallService = async (data) => {
  try {
    console.log("Received data:", JSON.stringify(data));

    const entry = data?.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;

    if (!value) {
      throw new Error("Invalid webhook data structure.");
    }

    if (value?.contacts?.[0]) {
      await handleIncomingMessage(value);
    } else if (value?.statuses?.[0]) {
      await handleStatusUpdate(value);
    } else {
      console.warn("No matching data structure found.");
    }

    return { message: "Webhook processed successfully." };
  } catch (error) {
    console.error("Error in webhook call service:", error);
    throw {
      statusCode: error.statusCode || 500,
      message: error.message || "Internal server error",
    };
  }
};

export const handleIncomingMessage = async (value) => {
  try {
    const contactNumber = value.contacts?.[0]?.wa_id;

    if (!contactNumber) {
      throw { statusCode: 400, message: "Contact number not found." };
    }

    let contact;
    try {
      contact = await DatabaseHelper.getRecords(
        ContactModel,
        { phoneNumber: contactNumber },
        {}
      );

      if (!contact || contact.length === 0) {
        contact = await DatabaseHelper.createRecord(ContactModel, {
          phoneNumber: contactNumber,
        });
      } else {
        contact = contact[0];
      }
    } catch (error) {
      throw {
        statusCode: 500,
        message: "Database error fetching/creating contact.",
        details: error,
      };
    }

    let conversation;
    try {
      conversation = await DatabaseHelper.getRecords(
        ConversationModel,
        { receiverId: contact._id },
        {}
      );

      if (!conversation || conversation.length === 0) {
        conversation = await DatabaseHelper.createRecord(ConversationModel, {
          receiverId: contact._id,
          senderId: "6763ab37b528bf585f1e6cc8",
          lastTextId: "00000000",
          unreadCount: 1,
          updatedAt: new Date(),
        });
      } else {
        const updateConversatioRecord = await DatabaseHelper.updateRecordById(
          ConversationModel,
          conversation[0]._id,
          {
            $inc: { unreadCount: 1 },
            updatedAt: new Date(),
          }
        );
        conversation = conversation[0];
      }
    } catch (error) {
      throw {
        statusCode: 500,
        message: "Database error fetching/creating conversation.",
        details: error,
      };
    }

    const message = value.messages?.[0];
    if (!message) {
      throw { statusCode: 400, message: "Message data not found." };
    }

    let textPayload;
    switch (message.type) {
      case "text":
        textPayload = {
          to: "15551866908",
          from: contactNumber,
          type: message.type,
          text: message.text?.body || "",
          IsIncoming: true,
          textId: message.id,
          conversationId: conversation._id,
          status: "",
        };
        break;

      case "image":
        try {
          const imageId = message.image.id;
          const mimeType = message.image.mime_type;
          const imageUrl = await downloadImageFromMeta(imageId);

          textPayload = {
            to: "15551866908",
            from: contactNumber,
            type: message.type,
            text: message.text?.body || "",
            url: imageUrl,
            IsIncoming: true,
            textId: message.id,
            conversationId: conversation._id,
            status: "",
          };
        } catch (error) {
          throw {
            statusCode: 500,
            message: "Error downloading image from Meta.",
            details: error,
          };
        }
        break;

      default:
        throw {
          statusCode: 400,
          message: `Unsupported message type: ${message.type}`,
        };
    }

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

      io.emit("newIncomingMessage", {
        text: textPayload.text,
        conversationId: conversation._id,
      });
      console.log(
        "New incoming message processed successfully:",
        textPayload.text
      );
      if (message.type == "text") {
        console.log("message.type == text");
        return true;
        // const response = await axios.post(
        //   process.env.AUTO_MESSAGE_SEND_URL,
        //         {
        //           "message": message.text?.body
        //       } ,
        // );
        // const payload = {
        //   to:[contactNumber],
        //   type:"text",
        //   preview_url:false,
        //   text:{
        //     body:response.data.response
        //   }
        // }
        //  await sendMessageService(payload)
      }
    } catch (error) {
      throw {
        statusCode: 500,
        message: "Error saving message data.",
        details: error,
      };
    }
  } catch (error) {
    console.error("Error handling incoming message:", error);
  }
};

export const handleStatusUpdate = async (value) => {
  try {
    const status = value.statuses?.[0];
    if (!status) {
      throw new Error("Status data not found.");
    }
    const textId = status.id;

    const campaignMessage = await DatabaseHelper.getRecords(
      CampaignMessageModel,
      { textId },
      {}
    );

    const updateStatus = async (statusType) => {
      try {
        if (campaignMessage.length) {
          const updatemessageStatus = await DatabaseHelper.updateRecordById(
            CampaignMessageModel,
            campaignMessage[0]._id,
            { status: statusType }
          );

          let updateFields = { $set: { updatedAt: new Date() } };

          if (statusType === "message_sent") {
            updateFields.$inc = { message_sent: 1 };
          } else if (statusType === "message_delivered") {
            updateFields.$inc = {
              message_delivered: 1,
              message_sent: -1,
            };
          } else if (statusType === "message_read") {
            updateFields.$inc = {
              message_read: 1,
              message_delivered: -1,
            };
          } else if (statusType === "message_failed") {
            updateFields.$inc = { message_failed: 1 };
          }

          const updateStatusCount = await DatabaseHelper.updateRecordById(
            CampaignModel,
            campaignMessage[0].campaignId,
            updateFields
          );
        }

        const textUpdate = await DatabaseHelper.updateRecordByKey(
          TextModel,
          { textId },
          { status: statusType }
        );

        io.emit(
          "UpdateStatusEvent",
          `status update for textId${textUpdate._id}`
        );
      } catch (error) {
        console.error("Error in updateStatus:", error.message);
      }
    };

    switch (status.status) {
      case "sent":
        await updateStatus("message_sent");
        break;
      case "delivered":
        await updateStatus("message_delivered");
        break;
      case "read":
        await updateStatus("message_read");
        break;
      case "failed":
        await updateStatus("message_failed");
        break;
      default:
        console.warn(`Unhandled status type: ${status.status}`);
        break;
    }
    io.emit("UpdateStatusEvent", `status update for ${textId}`);
  } catch (error) {
    throw {
      statusCode: error.statusCode || 500,
      message: error.message || "Internal server error",
    };
  }
};
