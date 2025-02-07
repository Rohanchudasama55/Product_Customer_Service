import express from "express";
import { createContactCntrlr,getContactByIdCntrlr,updateContactByIdCntrlr,deleteContactByIdCntrlr,getContactsCntrlr } from "../controller/ContactController.js";


const contactRoutes = express.Router();

contactRoutes.post("/contact",createContactCntrlr)
contactRoutes.get("/contact/:id",getContactByIdCntrlr)
contactRoutes.get("/contact",getContactsCntrlr)
contactRoutes.put("/contact/:id",updateContactByIdCntrlr)
contactRoutes.delete("/contact/:id",deleteContactByIdCntrlr)


export default contactRoutes;