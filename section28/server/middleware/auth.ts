import { Request, RequestHandler } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

//dotenv.config();

export const isAuth: RequestHandler = (req: Request, res, next) => {
  const header = req.get("Authorization");
  if (!header) {
    console.log("no header");
    req.isAuth = false;
    return next();
  }
  const token = header.split(" ")[1];
  let decodedToken;
  try {
    /* decodedToken = jwt.verify(
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imx1Y2E4OGlmdHMyMkBnbWFpbC5jb20iLCJ1c2VySWQiOiI2NTQyYjU5MTZhYTU3NWVlNWZjNTk1ZmQiLCJpYXQiOjE2OTkwMTQxNjcsImV4cCI6MTY5OTAxNzc2N30.J2ZwdQkXAbffx1N3MHF36Q0lvDrDmV433M2b6cELaNE",
      "CnUx7N!pDC&B5Z"
    ); */
    decodedToken = jwt.verify(token, process.env.JWT_KEY);
    console.log(decodedToken);
  } catch (error) {
    console.log("no decoded token");
    req.isAuth = false;
    return next();
  }
  if (!decodedToken) {
    console.log("no decoded token2");
    req.isAuth = false;
    return next();
  }
  req.isAuth = true;
  req.userId = decodedToken.userId;
  next();
};
