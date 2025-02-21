import User from "../model/UserModel.js";
import {
  generateJwtToken,
  bcryptComparePassword,
} from "../common/AuthHelper.js";

export const userLoginService = async (data) => {
  try {
    const { email, password } = data;
    const user = await User.findOne({ email });
      
    if (!user) {
      throw { statusCode: 404, message: "User does not exist." };
    }

    const isValidPassword = await bcryptComparePassword(
      password,
      user.password
    );

    if (!isValidPassword) {
      throw { statusCode: 401, message: "Incorrect password." };
    }

    const token = await generateJwtToken(user);

    return {
      token,
      role: user.role,
      name: user.name
    };
  } catch (error) {
    throw {
      statusCode: error.statusCode || 500,
      message: error.message || "Error during login",
      details: error.details || null,
    };
  }
};
