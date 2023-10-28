import { Request, RequestHandler } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import Utils from "../utils/utils";

dotenv.config();

export const isAuth: RequestHandler = (req: Request, res, next) => {
  const header = req.get("Authorization");
  if (!header) Utils.throwNewError("User not authenticated", 401);
  const token = header.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_KEY);
  } catch (error) {
    Utils.throwNewError(error, 500);
  }
  if (!decodedToken) Utils.throwNewError("User not authenticated", 401);
  //@ts-ignore
  req.userId = decodedToken.userId;
  next();
};
