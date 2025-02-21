import DatabaseHelper from "../common/DatabaseHelper.js";
import Templates from "../model/TemplateModel.js"
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const createtemplateService = async(templateData) => {
    try {
      let responseData;
        if(templateData.IsLibrary){
         try {
           const  data =  await DatabaseHelper.createRecord(Templates,templateData)
           responseData = data._id
         } catch (error) {
            throw{statuaCode: error.statuaCode,message: error.message || "error while store template in database"}
         }
        }

        if(templateData.IsMetaTemplate){
          try {
           const response = await axios.post(
              `https://graph.facebook.com/v21.0/429839343556898/message_templates/`,
              {
                ...templateData,
              },
              {
                headers: {
                  Authorization: `Bearer ${process.env.GRAPH_API_TOKEN}`,
                  "Content-Type": "application/json",
                },
              }
            );
            responseData = response.data.id
          } catch (error) {
            console.log("..........",error.response.data);
            
            let message;
             error.response ? message = error.response.data : message = error.message
             throw { statusCode: error.statusCode || 500, message: message || error.message || "Error in create Template Service" ,error };
          }
        }
        return responseData
      } catch (error) {
        console.log("error>>",error);
        
        throw { statusCode:  error.statusCode || 500, message: message || error.message || "Error in createUser Service" ,error };
      }
}

export const getAllMetatemplateService = async() =>  {
  try {
    const response = await axios.get(
      `https://graph.facebook.com/v21.0/429839343556898/message_templates/`,
      {
        headers: {
          Authorization: `Bearer ${process.env.GRAPH_API_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response && response.data.data.length) {
      return response.data.data;
    }
    if ( response.data.data.length) {
      throw { statusCode: 404, message: "Template Does Not Exist" };
  }
  } catch (error) {
    console.log("error>>",error);
    throw { 
      statusCode: error.statusCode || 500, 
      message: error.message || "Error fetching Template from Meta",  
  };
  }
}

export const getTemplateLibraryService = async(filter = {}, options = {}) => {
  try {
      return await DatabaseHelper.getRecords(Templates,filter, options);
  } catch (error) {
    throw { 
      statusCode: error.statusCode || 500, 
      message: error.message || "Error fetching Template from Meta",  
  };
  }
}