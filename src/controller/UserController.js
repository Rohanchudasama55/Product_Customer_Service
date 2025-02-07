import {sendSuccessResponse,sendErrorResponse} from "../common/Response.js"
import { createUserService,getUserByIdService,updateUserByIdService ,deleteUserByIdService,getUsersService} from "../services/UserServices.js"


export const createUserCntrlr = async(req,res) => {
    try {
        const {name,email,password,contact,role,managedBy} = req.body
        const userData = await createUserService({name,email,password,contact,role,managedBy})
            if(userData && userData._id){
                return sendSuccessResponse(res,"User Created Successfully",userData._id)
            }
            return sendErrorResponse(res,  500, "Something Went wrong"); 
    } catch (error) {
        return sendErrorResponse(res, error.statusCode || 500, error.message || "Internal Server Error"); 
    }
}

export const getUserByIdCntrlr = async (req, res) => {
    try {
        const user = await getUserByIdService(req.params.id);
        if(user && user._id){
            return sendSuccessResponse(res, "User fetched successfully", user);
        }else if(user && user.message){
            return sendSuccessResponse(res, user.message, null);
        }
        return sendErrorResponse(res,  500, "Something Went wrong"); 
    } catch (error) {
        return sendErrorResponse(res, error.statusCode || 500, error.message || "Internal Server Error");
    }
};


export const getUsersCntrlr = async (req, res) => {
    try {
        const users = await getUsersService({}, {});  
        return sendSuccessResponse(res, "Users fetched successfully", users);
    } catch (error) {
        return sendErrorResponse(res, error.statusCode || 500, error.message || "Internal Server Error");
    }
};


export const updateUserByIdCntrlr = async (req, res) => {
    try {
        const updatedUser = await updateUserByIdService(req.params.id, req.body);
        return sendSuccessResponse(res, "User updated successfully", updatedUser);
    } catch (error) {
        return sendErrorResponse(res, error.statusCode || 500, error.message || "Internal Server Error"
        );
    }
};

export const deleteUserByIdCntrlr = async (req, res) => {
    try {
        const deletedUser = await deleteUserByIdService(req.params.id);
        return sendSuccessResponse(res, "User deleted successfully", deletedUser);
    } catch (error) {
        return sendErrorResponse(res, error.statusCode || 500, error.message || "Internal Server Error");
    }
};