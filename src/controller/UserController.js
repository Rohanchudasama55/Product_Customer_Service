import { sendSuccessResponse, sendErrorResponse } from "../common/Response.js";
import {
  createUserService,
  getUserByIdService,
  updateUserByIdService,
  deleteUserByIdService,
  getUsersService,
  updateAdminRoleService,
} from "../services/UserServices.js";

export const createUserCntrlr = async (req, res) => {
  try {
    const { name, email, password, phoneNumber, role, managedBy } = req.body;
    const userData = await createUserService({
      name,
      email,
      password,
      phoneNumber,
      role,
      managedBy,
    });
    if (userData && userData._id) {
      return sendSuccessResponse(
        res,
        "User Created Successfully",
        userData._id,
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

export const getUserByIdCntrlr = async (req, res) => {
  try {
    const user = await getUserByIdService(req.params.id);
    if (user && user._id) {
      return sendSuccessResponse(res, "User fetched successfully", user, 200);
    } else if (user && user.message) {
      return sendSuccessResponse(res, user.message, null, 200);
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

export const getUsersCntrlr = async (req, res) => {
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

    const users = await getUsersService(filter, options);
    return sendSuccessResponse(res, "Users fetched successfully", users, 200);
  } catch (error) {
    return sendErrorResponse(
      res,
      error.statusCode || 500,
      error.message || "Internal Server Error"
    );
  }
};

export const updateUserByIdCntrlr = async (req, res) => {
  try {
    const updatedUser = await updateUserByIdService(req.params.id, req.body);
    return sendSuccessResponse(
      res,
      "User updated successfully",
      updatedUser,
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

export const adminRoleCntrlr = async (req, res) => {
  try {
    const adminData = req.user;
    const managedBy = req.body.managedBy;
    const updatedToken = await updateAdminRoleService({
      ...adminData,
      managedBy,
    });
    return sendSuccessResponse(
      res,
      "Admin Token updated successfully",
      updatedToken,
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

export const deleteUserByIdCntrlr = async (req, res) => {
  try {
    const deletedUser = await deleteUserByIdService(req.params.id);
    return sendSuccessResponse(
      res,
      "User deleted successfully",
      deletedUser,
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
