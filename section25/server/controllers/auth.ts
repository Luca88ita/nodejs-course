import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
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
    const name = req.body.name;
    bcrypt
      .hash(req.body.password, 12)
      .then((password) => {
        const user = new User({ email, password, name });
        return user.save();
      })
      .then((user) => {
        res
          .status(201)
          .json({ message: "User successfully created", userId: user._id });
      })
      .catch((err) => Utils.errorHandler(next, err));
  };

  export const getUser: RequestHandler = (req, res, next) => {};
}
