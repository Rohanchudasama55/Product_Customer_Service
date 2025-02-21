import {sendErrorResponse} from "../common/Response.js"


export const IsAdmin = async (req, res, next) => {
    try {
      if (req.user.role != "admin") {
       return sendErrorResponse(res,404,"Access Denied!!")
      }
      next();
    } catch (error) {
      throw {
        statusCode: error.status || 500,
        message: error.message || "error while IsAdmin!",
      };
    }
  };
  