import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { generateToken } from "../utils/jwt.js";

export const register = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    const error = new Error("Email already exists.");
    error.statusCode = 409;
    throw error;
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
};

export const login = async ({ email, password }) => {
  const user = await User.findOne({ email });

  if (!user) {
    console.log("account doesnt exist", user);

    const error = new Error("Account doesn't exist");
    error.statusCode = 401;
    throw error;
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    const error = new Error("Password Incorrect");
    error.statusCode = 401;
    throw error;
  }

  const token = generateToken({
    id: user._id,
    role: user.role,
  });

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};
