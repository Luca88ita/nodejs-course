import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import User from "../models/user";
import Utils from "../utils/utils";

export namespace AuthController {
  // creates and updates an existing user
  export const signup: RequestHandler = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      Utils.throwNewError(
        "Validation failed, entered data is incorrect.",
        422,
        errors.array()
      );
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;
  };

  export const getUser: RequestHandler = (req, res, next) => {};
}
