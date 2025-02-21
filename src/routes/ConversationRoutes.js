import express from "express";
import { getAllConversationCntrlr,getConversationByIdCntrlr, conversationInitiateCntrlr} from "../controller/ConversationController.js";
import {authGaurd} from "../middleware/authGaurd.js"
const conversationRoutes = express.Router();


conversationRoutes.post("/conversationInitiate/",authGaurd,conversationInitiateCntrlr)
conversationRoutes.get("/conversation",authGaurd,getAllConversationCntrlr)
conversationRoutes.get("/conversation/:id",authGaurd,getConversationByIdCntrlr)

export default conversationRoutes;