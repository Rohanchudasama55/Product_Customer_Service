export const sendSuccessResponse = (res, message, result = {}) => {
    return res.status(200).json({ success: true, message, result });
  };
  
  export const sendErrorResponse = (res, statusCode, message) => {
    return res.status(statusCode).json({ success: false, error: message});
  };
  