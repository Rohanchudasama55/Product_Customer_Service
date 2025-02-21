import databaseHelper from "../common/DatabaseHelper.js";
import Contact from "../model/ContactModel.js";
import ConversationModel from "../model/ConversationModel.js";

export const createContactService = async (data) => {
  try {
    const contactData = {
      ...data,
      phoneNumber: data.phoneNumber.replace(/\D/g, "") 
    };
    return await databaseHelper.createRecord(Contact, contactData);
  } catch (error) {
    throw {
      statusCode: error.statusCode || 500,
      message: error.message || "Error in createContact Service",
      error,
    };
  }
};

export const getContactByIdService = async (id) => {
  try {
    return await databaseHelper.getRecordById(Contact, id);
  } catch (error) {
    throw {
      statusCode: error.statusCode || 500,
      message: error.message || "Error in getContactByID Service",
      error,
    };
  }
};

export const getContactsService = async (filter, options) => {
  try {
    return await databaseHelper.getRecords(Contact, filter, options);
  } catch (error) {
    throw {
      statusCode: error.statusCode || 500,
      message: error.message || "Error fetching contacts",
      details: error.details || null,
    };
  }
};

export const updateContactByIdService = async (id, data) => {
  try {
    return await databaseHelper.updateRecordById(Contact, id, data);
  } catch (error) {
    throw {
      statusCode: error.statusCode || 500,
      message: error.message || "Error in updateContactByID Service",
      error,
    };
  }
};

export const deleteContactByIdService = async (id) => {
  try {
    const deletContact = await databaseHelper.deleteRecordById(Contact, id);
    const IsConversationExist = await databaseHelper.getRecords(
      ConversationModel,
      { receiverId: id },
      {}
    );
    if (IsConversationExist && IsConversationExist.length) {
      await databaseHelper.updateRecordById(
        ConversationModel,
        IsConversationExist[0]._id,
        { isDeleted: true }
      );
    }
    return deletContact;
  } catch (error) {
    throw {
      statusCode: error.statusCode || 500,
      message: error.message || "Error in deleteContactByID Service",
      error,
    };
  }
};
