import { sendSuccessResponse, sendErrorResponse } from "../common/Response.js";
import {
  createtemplateService,
  getAllMetatemplateService,
  getTemplateLibraryService,
} from "../services/TemplateServices.js";

export const createTemplateCntrlr = async (req, res) => {
  const {
    name,
    language,
    category,
    components,
    IsLibrary,
    IsMetaTemplate,
    variables,
  } = req.body;
  const url = req.url;
  if (
    !name ||
    !language ||
    !category ||
    !components ||
    components.length === 0
  ) {
    return res.status(400).json({ error: "Please Provide necessary field." });
  }
  try {
    const templateData = await createtemplateService({
      name,
      language,
      category,
      components,
      IsLibrary,
      IsMetaTemplate,
      variables,
      url,
    });
    if (templateData) {
      return sendSuccessResponse(
        res,
        "Template created successfully",
        templateData
      );
    }
    return sendErrorResponse(res, 500, "Something Went wrong");
  } catch (error) {
    return sendErrorResponse(
      res,
      error.statusCode || 500,
      error.message || "Internal Server Error"
    );
  }
};

export const getMetaTemplateCntrlr = async (req, res) => {
  try {
    const templates = await getAllMetatemplateService();
    return sendSuccessResponse(res, "Template Fetch Successfully", templates);
  } catch (error) {
    return sendErrorResponse(
      res,
      error.statusCode || 500,
      error.message || "Internal Server Error"
    );
  }
};

export const getTemplateLibraryCntrlr = async (req, res) => {
  try {
    // Capture the search term
    const search = req.query.search?.trim("") || "";
    const filter = search ? { name: { $regex: search, $options: "i" } } : {};

    // Set pagination options
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const options = { page: search ? 1 : page, limit };

    const templates = await getTemplateLibraryService(filter, options);
    return sendSuccessResponse(res, "Template Fetch Successfully", templates);
  } catch (error) {
    console.log("Error while getTemplateLibrary::", error);
    return sendErrorResponse(
      res,
      error.statusCode || 500,
      error.message || "Internal Server Error"
    );
  }
};
