import { campaignListServices,createCampaignService } from "../services/CampaignServices.js";
import { sendSuccessResponse, sendErrorResponse } from "../common/Response.js";



export const getAllCampaignCntrlr = async (req,res) => {
  try {
    let filter = {}
    if(req.user.role === "admin"){
      filter = {}
    }else{
      filter = {sourceBy:req.user.managedBy}
    }
    const campaigns = await campaignListServices(filter);
    return sendSuccessResponse(res, "Campaign fetched successfully", campaigns);
  } catch (error) {
    return sendErrorResponse(
      res,
      error.statusCode || 500,
      error.message || "Internal Server Error"
    );
  }
};


export const createCampaignCntrlr = async(req,res) => {
  try { 
    const sourceBy = req.user.managedBy
    const createdBy = req.user._id
    const data = req.body;
    if (!data) {
      return sendErrorResponse(res,400,"Bad Request")
    } 
    const campaignData = await createCampaignService({...data,sourceBy,createdBy})
    return sendSuccessResponse(res,"campaign created succesfully",campaignData)
  } catch (error) {
    return await sendErrorResponse(res, error.statusCode || 500, error.message || "Internal Server Error");
  }
}
