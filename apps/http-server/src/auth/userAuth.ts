import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/common-backend/config";
import "./types";

export default function userAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // get the authorization header
    const authorizationString = req.headers["authorization"];
    const token = authorizationString?.split(" ")[1];

    if (!token) {
      return res.status(403).json({
        error: "token not provided",
      });
    }

    const user = jwt.verify(token, JWT_SECRET);

    req.userId = (user as JwtPayload).userId;

    next();
  } catch (err) {
    return res.status(500).json({
      error: err,
    });
  }
}
