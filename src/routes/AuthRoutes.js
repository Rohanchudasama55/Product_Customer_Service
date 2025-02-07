import express from "express";
import { userLoginCntrl } from "../controller/AuthController.js";

const authRoutes = express.Router()

authRoutes.post("/login",userLoginCntrl)


export default authRoutes;


