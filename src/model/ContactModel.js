import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        default: null
    },
    phoneNumber:{
        type: String,
        required: true,
        unique:true
    },
    IsActive:{
        type: Boolean,
        default:true
    },
    sourceBy:{
        type: String,
        enum:['HRMS','BIOS'],
    }
}, {
    timestamps: true,
  })

export default mongoose.model('Contact', contactSchema);
