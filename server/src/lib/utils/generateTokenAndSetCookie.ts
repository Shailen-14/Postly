import jwt from "jsonwebtoken";
import env from "../../config/env.config.js";

export const generateTokenAndSetCookie = (res: any, id: number) => {
  const token = jwt.sign({ id }, env.JWT_SECRET!, {
    expiresIn: "30d",
  });

  const cookieOptions = {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  };

  res.cookie("token", token, cookieOptions);
};
