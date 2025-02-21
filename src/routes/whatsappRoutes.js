import express from "express";
import messageRoutes from "./MessageRoutes.js"
import templateRoutes from "./TemplateRoutes.js"
import conversationRoutes from "./ConversationRoutes.js";
import campaignRoutes from "./CampaignRoutes.js";
const whatsappRoutes = [messageRoutes,templateRoutes,conversationRoutes,campaignRoutes]
 

export default whatsappRoutes