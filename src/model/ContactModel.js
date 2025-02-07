import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        unique: true,
        required: false
    },
    contact:{
        type: String,
        required: true
    },
    IsActive:{
        type: Boolean,
        default:true
    },
    sourceBy:{
        type: String
    }
})

export default mongoose.model('Contact', contactSchema);
