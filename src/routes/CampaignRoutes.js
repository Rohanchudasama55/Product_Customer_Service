import express from "express";
import {
  getAllCampaignController,
  createCampaignController,
  getCampaignStatusCountsController,
} from "../controller/CampaignController.js";
import { authGaurd } from "../middleware/authGaurd.js";

const campaignRoutes = express.Router();

campaignRoutes.post("/create-campaign", authGaurd, createCampaignController);
campaignRoutes.get("/campaigns", authGaurd, getAllCampaignController);
campaignRoutes.get(
  "/campaign-status-counts",
  authGaurd,
  getCampaignStatusCountsController
);

export default campaignRoutes;
