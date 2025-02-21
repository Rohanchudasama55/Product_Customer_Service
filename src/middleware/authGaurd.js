import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import UserModel from "../model/UserModel.js";


export const authGaurd = async (req, res, next) => {
    try {
      const accessToken = req.headers["authorization"];
      
      const token = accessToken?.split("Bearer ")[1];

      if(!token){
        return res
        .status(401)
        .json({
          success: false,
          message: "token does not Exist!!",
        });
      }
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const isUserExist = await UserModel.findById(decoded._id);
      if (!isUserExist) {
        return res
          .status(401)
          .json({
            success: false,
            message: "Unauthorized Request. User does not exist.",
          });
      }
      req.user = isUserExist;
      next();
    } catch (err) {
      if (err.name === "JsonWebTokenError") {
        return res
          .status(401)
          .json({
            success: false,
            message: "Unauthorized Request. Invalid token.",
          });
      } else if (err.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({
            success: false,
            message: "Unauthorized Request. Token expired.",
          });
      }
      return res
        .status(500)
        .json({
          success: false,
          message: "Internal Server Error.",
          error: err.message,
        });
    }
  };