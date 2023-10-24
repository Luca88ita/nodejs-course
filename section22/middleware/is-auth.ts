import { RequestHandler } from "express";
import { RequestData } from "../util/types";

export const isAuth: RequestHandler = (req: RequestData, res, next) => {
  if (!req.session.isLoggedIn) return res.redirect("/login");
  next();
};
