import { Response } from "express";
import jwt from "jsonwebtoken";

export const generateToken = (userId: string, res: Response) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });
  res.cookie("token", token, {
    httpOnly: true, // Prevents client-side JavaScript from accessing the token
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    sameSite: "strict", // CSRF protection
  });
  return token;
};
