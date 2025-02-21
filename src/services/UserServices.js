import databaseHelper from "../common/DatabaseHelper.js"
import User from "../model/UserModel.js"
import { bcryptPassword } from "../common/AuthHelper.js"
import { generateJwtToken } from "../common/AuthHelper.js"


export const createUserService = async(data) => {
    try {   
        const hashedPassword = await bcryptPassword(data.password)
        delete data.password
        return await databaseHelper.createRecord(User,{...data,password:hashedPassword})
    } catch (error) {
        throw { statusCode: 500, message: error.message || "Error in createUser Service" ,error };
    }
}

export const getUserByIdService = async (id) => {
    try {
        return await databaseHelper.getRecordById(User, id);
    } catch (error) {
        throw { statusCode: 500, message: error.message || "Error in getUserByID Service" ,error };
    }
};

export const getUsersService = async (filter = {}, options = {}) => {
    try {
        return await databaseHelper.getRecords(User, filter, options);
    } catch (error) {
        throw { 
            statusCode: error.statusCode || 500, 
            message: error.message || "Error fetching users", 
            details: error.details || null 
        };
    }
};

export const updateUserByIdService = async (id, data) => {
    try {
        return await databaseHelper.updateRecordById(User, id, data);
    } catch (error) {
        throw { statusCode: error.statusCode || 500, message: error.message || "Error in updateUserByID Service" ,error };
    }
};

export const updateAdminRoleService = async(data) => {
    try {
        const managedBy = data.managedBy
        const updateAdminRole = await databaseHelper.updateRecordById(User,data._doc._id,{managedBy})
        return  await generateJwtToken(updateAdminRole);
    } catch (error) {
        throw { statusCode: error.statusCode || 500, message: error.message || "Error while update Admin Role Service" ,error };
    }
}

export const deleteUserByIdService = async (id) => {
    try {
        return await databaseHelper.deleteRecordById(User, id);
    } catch (error) {
        throw { statusCode: error.statusCode || 500, message: error.message || "Error in deleteUserByID Service" ,error };
    }
};