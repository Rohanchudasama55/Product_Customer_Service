export const sendSuccessResponse = (
  res,
  message,
  result = {},
  statusCode = 200
) => {
  return res.status(200).json({ success: true, statusCode, message, result });
};

export const sendErrorResponse = (res, statusCode, message) => {
  return res
    .status(statusCode)
    .json({ success: false, statusCode, error: message });
};
