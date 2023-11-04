import { Request, RequestHandler } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

//dotenv.config();

export const isAuth: RequestHandler = (req: Request, res, next) => {
  const header = req.get("Authorization");
  if (!header) {
    req.isAuth = false;
    return next();
  }
  const token = header.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_KEY);
  } catch (error) {
    req.isAuth = false;
    return next();
  }
  if (!decodedToken) {
    req.isAuth = false;
    return next();
  }
  req.isAuth = true;
  req.userId = decodedToken.userId;
  next();
};
