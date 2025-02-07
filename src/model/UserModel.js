import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
    },
    password:{
        type: String,
    },
    contact:{
        type: String,
        required: true
    },
    role:{
        type: String,
        required: true,
        enum: ['user','admin'],
        default:'user'
    },
    managedBy:{
        type: String,
        required: true
    }
})

export default mongoose.model('User', userSchema);
