import { userLoginService } from "../services/AuthServices.js";
import {sendSuccessResponse,sendErrorResponse} from "../common/Response.js"

export const userLoginCntrl = async (req, res) => {
    try {
        const { email, password } = req.body;
        const response = await userLoginService({ email, password });
        return sendSuccessResponse(res, "Login successful!", response);
    } catch (error) {
        console.error("Error in User Login:", error);
        return sendErrorResponse(res, error.statusCode || 500, error.message, error.details);
    }
};