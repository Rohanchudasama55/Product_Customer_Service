import express from "express";
import { createContactCntrlr,getContactByIdCntrlr,updateContactByIdCntrlr,deleteContactByIdCntrlr,getContactsCntrlr } from "../controller/ContactController.js";
import {authGaurd} from "../middleware/authGaurd.js"

const contactRoutes = express.Router();

contactRoutes.post("/contact",createContactCntrlr)
contactRoutes.get("/contact/:id",authGaurd,getContactByIdCntrlr)
contactRoutes.get("/contact",authGaurd,getContactsCntrlr)
contactRoutes.put("/contact/:id",updateContactByIdCntrlr)
contactRoutes.delete("/contact/:id",deleteContactByIdCntrlr)

export default contactRoutes;