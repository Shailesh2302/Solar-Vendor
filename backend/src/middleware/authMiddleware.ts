import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/prisma";
import { verifyAccessToken } from "../utils/jwt";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    username: string;
    email: string;
    role: string;
  };
}

export const protectRoute = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies?.jwt;

    if (!token) {
      res.status(401).json({ message: "Unauthorized - No Token Provided" });
      return;
    }

    const decoded = verifyAccessToken(token);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, username: true, email: true, role: true },
    });

    if (!user) {
      res.status(401).json({ message: "Unauthorized - User not found" });
      return;
    }

    req.user = user;
    next();
  } catch (error: any) {
    console.error("Error in protectRoute middleware:", error.message);
    res.status(401).json({ message: "Unauthorized - Invalid or expired token" });
  }
};
