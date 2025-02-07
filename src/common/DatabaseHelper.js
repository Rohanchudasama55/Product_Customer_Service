class DatabaseHelper {
   
    static async createRecord(Model, data) {
        try {
            const document = new Model(data);
            return await document.save();
        } catch (error) {
            throw { statusCode: 500, message: "Error saving to database", details: error.message };
        }
    }

   
    static async getRecordById(Model, id) {
        try {
            const document = await Model.findById(id);
            if (!document) {
               return { statusCode: 404, message: "Record not found" };
            }
            return document;
        } catch (error) {
            throw { statusCode: error.statusCode || 500, message: "Error fetching record", details: error.message };
        }
    }

    
    static async getRecords(Model, filter = {}, options = {}) {
        try {
            const documents = await Model.find(filter, null, options);
            if (!documents || documents.length === 0) {
                throw { statusCode: 404, message: "Record not found" };
            }

            return documents;
        } catch (error) {
            throw { 
                statusCode: error.statusCode || 500, 
                message: error.message || "Error fetching records", 
                details: error.details || error.message 
            };
        }
    }
   
    static async updateRecordById(Model, id, data) {
        try {
            const document = await Model.findByIdAndUpdate(id, data, { new: true, runValidators: true });
            if (!document) {
                throw { statusCode: 404, message: "Record not found" };
            }
            return document;
        } catch (error) {
            throw {
                statusCode: error.statusCode || 500,
                message: error.message || "Error updating record",
            };
        }
    }

  
    static async deleteRecordById(Model, id) {
        try {
            const document = await Model.findByIdAndDelete(id);
            if (!document) {
                throw { statusCode: 404, message: "Record not found" };
            }
            return { message: "Record deleted successfully", document };
        } catch (error) {
            throw { statusCode: error.statusCode || 500, message: error.message ||  "Error deleting record", details: error.message };
        }
    }
}

export default DatabaseHelper;
