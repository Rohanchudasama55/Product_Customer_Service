import {
  createGroupService,
  getAllGroupService,
  getGroupByIdService,
} from "../services/GroupService.js";
import { sendSuccessResponse, sendErrorResponse } from "../common/Response.js";

export const createGroupCntrlr = async(req,res) => {
    try {
        const {groupName,contactIds} = req.body
        const sourceBy = req.user.managedBy
            if(!groupName || !contactIds.length || !sourceBy){
                throw {statusCode:400,message:"Enter neccesory filled"}
            }   
           const groupData = await createGroupService({groupName,contactIds,sourceBy})
               if(groupData && groupData._id){
                   return sendSuccessResponse(res,"Group Created Successfully",groupData._id)
               }
               return sendErrorResponse(res,  500, "Something Went wrong"); 
       } catch (error) {
           return sendErrorResponse(res, error.statusCode || 500, error.message || "Internal Server Error"); 
       }
}

export const getAllGroupRecordCntrlr = async (req, res) => {
  try {
    const sourceBy = req.user.managedBy;
    // Set pagination options
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const options = { page, limit };

    const groupsRecord = await getAllGroupService(sourceBy.options);
    if (groupsRecord.length === 0) {
      return sendErrorResponse(res, 200, "Group Does Not Exist!!");
    }
    return sendSuccessResponse(
      res,
      "Group Record fetched Successfully",
      groupsRecord
    );
  } catch (error) {
    return sendErrorResponse(
      res,
      error.statusCode || 500,
      error.message || "Internal Server Error"
    );
  }
};

export const getGroupByIdCntrlr = async (req, res) => {
  try {
    const groupId = req.params.id;
    const { page = 1, limit = 10, search = "" } = req.query;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    const groupsRecord = await getGroupByIdService(groupId, pageNumber, limitNumber, search);

    if (!groupsRecord) {
      return sendErrorResponse(res, 404, "Group not found");
    }

    if (!groupsRecord.data.length) {
      return sendSuccessResponse(res, "No contacts found for this group.", groupsRecord);
    }

    return sendSuccessResponse(res, "Group Record fetched Successfully", groupsRecord);
  } catch (error) {
    return sendErrorResponse(
      res,
      error.statusCode || 500,
      error.message || "Internal Server Error"
    );
  }
};