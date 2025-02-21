import { sendSuccessResponse, sendErrorResponse } from "../common/Response.js";
import {
  createContactService,
  getContactByIdService,
  getContactsService,
  updateContactByIdService,
  deleteContactByIdService,
} from "../services/ContactServices.js";

export const createContactCntrlr = async (req, res) => {
  try {
    const { name, email, phoneNumber, sourceBy } = req.body;
    if (!sourceBy) {
      sourceBy = req.user.managedBy;
    }
    const contactData = await createContactService({
      name,
      email,
      phoneNumber,
      sourceBy,
    });
    return sendSuccessResponse(
      res,
      "Contact created successfully",
      contactData
    );
  } catch (error) {
    return sendErrorResponse(
      res,
      error.statusCode || 500,
      error.message || "Internal Server Error"
    );
  }
};

export const getContactByIdCntrlr = async (req, res) => {
  try {
    const contact = await getContactByIdService(req.params.id);
    return sendSuccessResponse(res, "Contact fetched successfully", contact);
  } catch (error) {
    return sendErrorResponse(
      res,
      error.statusCode || 500,
      error.message || "Internal Server Error"
    );
  }
};

export const getContactsCntrlr = async (req, res) => {
  try {
    // Capture the search term
    const search = req.query.search?.trim("") || "";
    const filter = search
      ? {
          $or: [
            { email: { $regex: search, $options: "i" } },
            { name: { $regex: search, $options: "i" } },
            { phoneNumber: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    // Set pagination options
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const options = { page: search ? 1 : page, limit };

    const sourceBy = req.user.managedBy;
    const contacts = await getContactsService({ ...filter, sourceBy }, options);
    return sendSuccessResponse(res, "Contacts fetched successfully", contacts);
  } catch (error) {
    return sendErrorResponse(
      res,
      error.statusCode || 500,
      error.message || "Internal Server Error"
    );
  }
};

export const updateContactByIdCntrlr = async (req, res) => {
  try {
    const updatedContact = await updateContactByIdService(
      req.params.id,
      req.body
    );
    return sendSuccessResponse(
      res,
      "Contact updated successfully",
      updatedContact
    );
  } catch (error) {
    return sendErrorResponse(
      res,
      error.statusCode || 500,
      error.message || "Internal Server Error"
    );
  }
};

export const deleteContactByIdCntrlr = async (req, res) => {
  try {
    const deletedContact = await deleteContactByIdService(req.params.id);
    return sendSuccessResponse(
      res,
      "Contact deleted successfully",
      deletedContact
    );
  } catch (error) {
    return sendErrorResponse(
      res,
      error.statusCode || 500,
      error.message || "Internal Server Error"
    );
  }
};
