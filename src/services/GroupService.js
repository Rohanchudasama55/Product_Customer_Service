import databaseHelper from "../common/DatabaseHelper.js";
import GroupModel from "../model/GroupModel.js"
import Contact from "../model/ContactModel.js";  



export const createGroupService = async(data) => {
    try {   
        return await databaseHelper.createRecord(GroupModel,data)
    } catch (error) {
        throw { statusCode: error.statusCode || 500, message: error.message || "Error in createGroup Service" ,error };
    }
}

export const getAllGroupService = async(sourceBy) => {
    try {
        return await databaseHelper.getRecords(GroupModel,{sourceBy},{ projection: { groupName: 1 } })
    } catch (error) {
        throw {statusCode: error.statusCode || 500, message : error.message || "Error While getAllGroupService" }        
    }
}


export const getGroupByIdService = async (groupId) => {
    try {
        const group = await GroupModel.findById(groupId)
            .populate("contactIds"); 
        if (!group) {
            throw { statusCode: 404, message: "Group not found" };
        }
        return group;
    } catch (error) {
        throw { 
            statusCode: error.statusCode || 500, 
            message: error.message || "Error While getGroupByIdService" 
        };
    }
};
