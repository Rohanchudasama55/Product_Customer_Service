import {
  createGroupService,
  getAllGroupService,
  getGroupByIdService,
} from "../services/GroupService.js";
import { sendSuccessResponse, sendErrorResponse } from "../common/Response.js";

export const createGroupCntrlr = async (req, res) => {
  try {
    const { groupName, contactIds } = req.body;
    const sourceBy = req.user.managedBy;
    if (!groupName || !contactIds.length || !sourceBy) {
      throw { statusCode: 400, message: "Enter neccesory filled" };
    }
    const groupData = await createGroupService({
      groupName,
      contactIds,
      sourceBy,
    });
    if (groupData && groupData._id) {
      return sendSuccessResponse(
        res,
        "Group Created Successfully",
        groupData._id,
        201
      );
    }
    return sendErrorResponse(res, 500, "Something Went wrong");
  } catch (error) {
    return sendErrorResponse(
      res,
      error.statusCode || 500,
      error.message || "Internal Server Error"
    );
  }
};

export const getAllGroupRecordCntrlr = async (req, res) => {
  try {
    const sourceBy = req.user.managedBy;
    const groupId = req.param.id;
    // Set pagination options
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const options = { page, limit };

    const groupsRecord = await getAllGroupService(sourceBy, options);
    if (groupsRecord.length === 0) {
      return sendErrorResponse(res, 200, "Group Does Not Exist!!");
    }
    return sendSuccessResponse(
      res,
      "Group Record fetched Successfully",
      groupsRecord,
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

export const getGroupByIdCntrlr = async (req, res) => {
  try {
    const groupId = req.params.id;
    const sourceBy = req.user.managedBy;
    const groupsRecord = await getGroupByIdService(groupId, sourceBy);
    if (groupsRecord && groupsRecord._id && !groupsRecord.contactIds.length) {
      return sendSuccessResponse(res, "Contact does not exist in this Group!!");
    }
    return sendSuccessResponse(
      res,
      "Group Record fetched Successfully",
      groupsRecord,
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
