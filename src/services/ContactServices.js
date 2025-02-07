import databaseHelper from "../common/DatabaseHelper.js";
import Contact from "../model/ContactModel.js";

export const createContactService = async (data) => {
    try {   
        return await databaseHelper.createRecord(Contact, data);
    } catch (error) {
        throw { statusCode: error.statusCode || 500, message: error.message || "Error in createContact Service", error };
    }
};

export const getContactByIdService = async (id) => {
    try {
        return await databaseHelper.getRecordById(Contact, id);
    } catch (error) {
        throw { statusCode: error.statusCode || 500, message: error.message || "Error in getContactByID Service", error };
    }
};

export const getContactsService = async (filter = {}, options = {}) => {
    try {
        return await databaseHelper.getRecords(Contact, filter, options);
    } catch (error) {
        throw { 
            statusCode: error.statusCode || 500, 
            message: error.message || "Error fetching contacts", 
            details: error.details || null 
        };
    }
};

export const updateContactByIdService = async (id, data) => {
    try {
        return await databaseHelper.updateRecordById(Contact, id, data);
    } catch (error) {
        throw { statusCode: error.statusCode || 500, message: error.message || "Error in updateContactByID Service", error };
    }
};

export const deleteContactByIdService = async (id) => {
    try {
        return await databaseHelper.deleteRecordById(Contact, id);
    } catch (error) {
        throw { statusCode: error.statusCode || 500, message: error.message || "Error in deleteContactByID Service", error };
    }
};
