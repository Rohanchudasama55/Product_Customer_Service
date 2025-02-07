import {sendSuccessResponse,sendErrorResponse} from "../common/Response.js"
import {createtemplateService,getAllMetatemplateService,getTemplateLibraryService} from "../services/TemplateServices.js"


export const createTemplateCntrlr = async (req, res) => {
    const {  name, language, category, components,IsCreateInWhatsapp,library_category } = req.body;
    if (
      !name ||
      !language ||
      !category ||
      !components ||
      components.length === 0 ||
      !IsCreateInWhatsapp ||
      !library_category
    ) {
      return res.status(400).json({ error: "Please Provide necessary field." });
    }
    try {
      const templateData = await createtemplateService({
        name,
        language,
        category,
        components,
      });
      if (templateData && templateData._id) {
        return sendSuccessResponse(res,"Template created successfully",templateData._id)
      }
      return sendErrorResponse(res,  500, "Something Went wrong"); 
    } catch (error) {
      return sendErrorResponse(res, error.statusCode || 500, error.message || "Internal Server Error");
    }
  };

  export const getMetaTemplateCntrlr = async(req,res) => {
    try { 
      const templates = await getAllMetatemplateService()
      return sendSuccessResponse(res,"Template Fetch Successfully",templates)
    } catch (error) {
      return sendErrorResponse(res, error.statusCode || 500, error.message || "Internal Server Error"); 
    }
  }

  export const getTemplateLibraryCntrlr = async(req,res) => {
    try {
      const templates = await getTemplateLibraryService({},{})
      return sendSuccessResponse(res,"Template Fetch Successfully",templates)
    } catch (error) {
      console.log(error);
      return sendErrorResponse(res, error.statusCode || 500, error.message || "Internal Server Error"); 
    }
  }

