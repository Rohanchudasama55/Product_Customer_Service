import express from "express";
import { createUserCntrlr,getUserByIdCntrlr,updateUserByIdCntrlr,deleteUserByIdCntrlr,getUsersCntrlr } from "../controller/UserController.js";


const userRoutes = express.Router();

userRoutes.post("/user",createUserCntrlr)
userRoutes.get("/user/:id",getUserByIdCntrlr)
userRoutes.get("/user",getUsersCntrlr)
userRoutes.put("/user/:id",updateUserByIdCntrlr)
userRoutes.delete("/user/:id",deleteUserByIdCntrlr)


export default userRoutes;