import jwt from "jsonwebtoken";
import brcypt from "bcryptjs";
import dotenv from "dotenv"
dotenv.config()

export const generateJwtToken = async(user) => {
    try {
         return jwt.sign({_id:user._id,email:user.email}, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });
    } catch (error) {
        throw new Error(error)
    }
}

export const bcryptPassword = async(password) => {
    try {
        const salt = await brcypt.genSalt(10);
        return await brcypt.hash(password, salt);
    } catch (error) {
        throw new Error(error)
    }
}

export const bcryptComparePassword = async(password,storedPassword) => {
    try {
        return await brcypt.compare(password, storedPassword);
    } catch (error) {
        throw new Error(error)
    }
}