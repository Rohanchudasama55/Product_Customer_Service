import express from "express";
import { createUserCntrlr,getUserByIdCntrlr,updateUserByIdCntrlr,deleteUserByIdCntrlr,getUsersCntrlr,adminRoleCntrlr } from "../controller/UserController.js";
import {authGaurd} from "../middleware/authGaurd.js"
import { IsAdmin } from "../middleware/IsExistMiddleware.js";

const userRoutes = express.Router();

userRoutes.post("/user",authGaurd,IsAdmin,createUserCntrlr)
userRoutes.get("/user/:id",authGaurd,getUserByIdCntrlr)
userRoutes.post("/admin",authGaurd,IsAdmin,adminRoleCntrlr)
userRoutes.get("/user",authGaurd,getUsersCntrlr)
userRoutes.put("/user/:id",authGaurd,IsAdmin,updateUserByIdCntrlr)
userRoutes.delete("/user/:id",authGaurd,IsAdmin,deleteUserByIdCntrlr)

export default userRoutes;