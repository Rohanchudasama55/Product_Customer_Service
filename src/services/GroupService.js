import databaseHelper from "../common/DatabaseHelper.js";
import GroupModel from "../model/GroupModel.js";

export const createGroupService = async (data) => {
  try {
    return await databaseHelper.createRecord(GroupModel, data);
  } catch (error) {
    throw {
      statusCode: error.statusCode || 500,
      message: error.message || "Error in createGroup Service",
      error,
    };
  }
};

export const getAllGroupService = async (sourceBy, options) => {
  try {
    return await databaseHelper.getRecords(
      GroupModel,
      { sourceBy },
      {options, projection: { groupName: 1 } }
    );
  } catch (error) {
    throw {
      statusCode: error.statusCode || 500,
      message: error.message || "Error While getAllGroupService",
    };
  }
};

export const getGroupByIdService = async (groupId, page, limit, search) => {
  try {
    const skip = (page - 1) * limit;
    
    const searchFilter = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } }, 
            { email: { $regex: search, $options: "i" } },
            { phoneNumber: { $regex: search, $options: "i" } },
          ],
        }
      : {}; 

    const group = await GroupModel.findById(groupId).populate({
      path: "contactIds",
      match: searchFilter,
      options: { skip, limit }, 
    });

    if (!group) {
      throw { statusCode: 404, message: "Group not found" };
    }

    const totalContacts = await GroupModel.findById(groupId)
      .populate({ path: "contactIds", match: searchFilter })
      .select("contactIds")
      .lean();
    const totalRecords = totalContacts?.contactIds?.length || 0;

    return {
      _id: group._id,
      name: group.groupName,
      totalContacts: totalRecords,
      contactsPerPage: limit,
      currentPage: page,
      totalPages: Math.ceil(totalRecords / limit),
      data: group.contactIds, 
    };
  } catch (error) {
    throw {
      statusCode: error.statusCode || 500,
      message: error.message || "Error While getGroupByIdService",
    };
  }
};