import {
  campaignListServices,
  campaignStatusCountsServices,
  createCampaignService,
} from "../services/CampaignServices.js";
import { sendSuccessResponse, sendErrorResponse } from "../common/Response.js";

export const getAllCampaignController = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === "admin") {
      filter = {};
    } else {
      filter = { sourceBy: req.user.managedBy };
    }

    // Set pagination options
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const options = { page, limit };

    // Add filters for date range
    const { start_date, end_date } = req.query;
    if (start_date && end_date) {
      const start = new Date(start_date);
      start.setHours(0, 0, 0, 0);

      const end = new Date(end_date);
      end.setHours(23, 59, 59, 999);

      filter.createdAt = {
        $gte: start,
        $lte: end,
      };
    }

    const campaigns = await campaignListServices(filter, options);
    return sendSuccessResponse(
      res,
      "Campaign fetched successfully",
      campaigns,
      200
    );
  } catch (error) {
    return sendErrorResponse(
      res,
      error.statusCode || 500,
      error.message || "Internal Server Error"
    );
  }
};

export const createCampaignController = async (req, res) => {
  try {
    const sourceBy = req.user.managedBy;
    const createdBy = req.user._id;
    const data = req.body;
    if (!data) {
      return sendErrorResponse(res, 400, "Bad Request");
    }
    const campaignData = await createCampaignService({
      ...data,
      sourceBy,
      createdBy,
    });
    return sendSuccessResponse(
      res,
      "campaign created succesfully",
      campaignData,
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

// Controller for fetching the campaign status counts
export const getCampaignStatusCountsController = async (req, res) => {
  try {
    // Define sourceby data from query parameter
    const sourceBy = req.user.managedBy;

    // Call service to fetch the campaign status counts
    const campaigns = await campaignStatusCountsServices(sourceBy);
    if (campaigns && campaigns.length > 0) {
      const campaignData = campaigns[0];
      delete campaignData._id;
    }

    // Return success response with the campaign data
    return sendSuccessResponse(
      res,
      "Campaign status counts fetched successfully",
      campaigns,
      200
    );
  } catch (error) {
    return sendErrorResponse(
      res,
      error.statusCode || 500,
      error.message || "Internal Server Error"
    );
  }
};
