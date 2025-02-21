import express from "express";
import { sendMessageCntrlr,webhookVerifyCntrlr,getWebhookCall } from "../controller/MessageController.js";
import {authGaurd} from "../middleware/authGaurd.js"

const messageRoutes = express.Router()

messageRoutes.post("/send-message",authGaurd,sendMessageCntrlr)
messageRoutes.get('/webhook',  webhookVerifyCntrlr)
messageRoutes.post("/webhook",getWebhookCall)


export default messageRoutes;