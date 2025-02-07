import express from "express";
import { createTemplateCntrlr,getMetaTemplateCntrlr ,getTemplateLibraryCntrlr} from "../controller/TemplateController.js";

const templateRoutes = express.Router()

templateRoutes.post("/create-template",createTemplateCntrlr)
templateRoutes.get("/template-meta",getMetaTemplateCntrlr)
templateRoutes.get("/template-library",getTemplateLibraryCntrlr)




export default templateRoutes;


