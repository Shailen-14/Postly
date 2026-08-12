import type { Request, Response } from "express";
import * as queries from "../db/queries.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../lib/utils/generateTokenAndSetCookie.js";
import env from "../config/env.config.js";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Required fields are not provided" });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password requires a minimum of 8 characters" });
    }

    const existingUser = await queries.getUserByEmailOrUsername(
      email,
      username,
    );

    if (existingUser) {
      if (existingUser.email === email) {
        return res
          .status(400)
          .json({ message: "Email already registered" });
      } else if (existingUser.username === username) {
        return res.status(400).json({ message: "Username is already taken" });
      } else {
        return res.status(400).json({
          message: "Email already registered",
        });
      }
    }

    const genSalt = 10;
    const hashedPassword = await bcrypt.hash(password, genSalt);

    const user = await queries.createUser({
      username,
      email,
      password: hashedPassword,
    });

    generateTokenAndSetCookie(res, user.id);

    return res.status(201).json({ user });
  } catch (error) {
    return res.status(500).json({ message: `Internal Server Error: ${error}` });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Required fields are not provided" });
    }

    const user = await queries.getUserByUsername(username);

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    generateTokenAndSetCookie(res, user.id);

    const { password: _, ...userWithoutPassword } = user;

    return res.status(200).json({ user: userWithoutPassword });
  } catch (error) {
    return res.status(500).json({ message: `Internal Server Error: ${error}` });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    const user = await queries.getUserById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({
      message: `Internal Server Error: ${error}`,
    });
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ message: `Internal Server Error: ${error}` });
  }
};
