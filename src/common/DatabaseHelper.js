import mongoose from "mongoose";

class DatabaseHelper {
  static async createRecord(Model, data) {
    try {
      const document = new Model(data);
      return await document.save();
    } catch (error) {
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        throw {
          statusCode: 400,
          message: `${field} already exists.`,
        };
      }
      throw {
        statusCode: 500,
        message: error.message || "Error saving to database",
      };
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
      throw {
        statusCode: error.statusCode || 500,
        message: "Error fetching record",
        details: error.message,
      };
    }
  }
  static async getRecordByIdFilter(
    Model,
    id,
    filter = {},
    populateFields = ""
  ) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw { statusCode: 400, message: "Invalid ID format" };
      }

      let query = Model.findOne({ _id: id, ...filter });

      if (populateFields) {
        query = query.populate(populateFields);
      }

      const document = await query.exec();

      return document;
    } catch (error) {
      throw {
        statusCode: error.statusCode || 500,
        message: error.message || "Error fetching record by ID",
        details: error.details || error.message,
      };
    }
  }

  static async getRecords(Model, filter, options = {}) {
    try {
      // Extract page and limit from options
      const { page = 1, limit = 10, projection = {} } = options;

      // Calculate skip based on the page and limit
      const skip = (page - 1) * limit;

      // Query options for MongoDB
      const queryOptions = {
        projection,
        skip,
        limit,
      };

      // Find documents based on filter and options
      const documents = await Model.find(filter, projection, queryOptions);

      if (!documents || documents.length === 0) {
        return { data: [], total: 0 };
      }

      // Get total count of documents matching the filter for pagination info
      const total = await Model.countDocuments(filter);

      // Return the documents along with pagination metadata
      return {
        data: documents,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      throw {
        statusCode: error.statusCode || 500,
        message: error.message || "Error fetching records",
        details: error.details || error.message,
      };
    }
  }

  static async updateRecordById(Model, id, data) {
    try {
      const updatedRecord = await Model.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      });
      return updatedRecord;
    } catch (error) {
      throw {
        statusCode: error.statusCode || 500,
        message: error.message || "Error updating record",
      };
    }
  }

  static async updateRecordByKey(Model, filter, data) {
    try {
      if (!filter || Object.keys(filter).length === 0) {
        throw { statusCode: 400, message: "Filter criteria is required" };
      }

      if (!data || Object.keys(data).length === 0) {
        throw { statusCode: 400, message: "No valid fields to update" };
      }
      const document = await Model.findOneAndUpdate(filter, data, {
        new: true,
        runValidators: true,
      });

      if (!document) {
        throw { statusCode: 404, message: "Record not found" };
      }

      return document;
    } catch (error) {
      throw {
        statusCode: error.statusCode || 500,
        message: error.message || "Error updating record",
        details: error,
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
      throw {
        statusCode: error.statusCode || 500,
        message: error.message || "Error deleting record",
        details: error.message,
      };
    }
  }
}

export default DatabaseHelper;
