import  express from "express";
import { createGroupCntrlr,getAllGroupRecordCntrlr,getGroupByIdCntrlr } from "../controller/GroupController.js";
import { authGaurd } from "../middleware/authGaurd.js";
const groupRoutes = express.Router()


groupRoutes.post("/createGroup",authGaurd,createGroupCntrlr)
groupRoutes.get("/groups",authGaurd,getAllGroupRecordCntrlr)
groupRoutes.get("/groupById/:id",authGaurd,getGroupByIdCntrlr)


export default groupRoutes