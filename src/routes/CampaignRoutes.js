import express from "express";
import {getAllCampaignCntrlr,createCampaignCntrlr} from "../controller/CampaignController.js"
import { authGaurd } from "../middleware/authGaurd.js";

const campaignRoutes = express.Router();

campaignRoutes.post("/create-campaign",authGaurd,createCampaignCntrlr)
campaignRoutes.get("/campaigns",authGaurd,getAllCampaignCntrlr)

export default campaignRoutes