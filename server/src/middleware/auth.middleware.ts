import jwt, { JwtPayload } from "jsonwebtoken";
import env from "../config/env.config.js";
import * as queries from "../db/queries.js";

export const protectRoute = async (req: any, res: any, next: any) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        message: "Not authorized, no token provided",
      });
    }

    const decoded = jwt.verify(token, env.JWT_SECRET!) as JwtPayload & {
      id: number;
    };

    if (!decoded.id) {
      return res.status(401).json({
        message: "Not authorized, invalid token",
      });
    }

    const user = await queries.getUserById(decoded.id);

    if (!user) {
      return res.status(401).json({
        message: "User no longer exists",
      });
    }

    req.userId = decoded.id;

    return next();
  } catch (error) {
    console.error("Protect route error:", error);

    return res.status(401).json({
      message: "Not authorized, token failed",
    });
  }
};
