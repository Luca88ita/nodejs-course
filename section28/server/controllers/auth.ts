import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user";
import Utils from "../utils/utils";

dotenv.config();

export namespace AuthController {
  // creates and updates an existing user
  export const signup: RequestHandler = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        Utils.throwNewError(
          "Validation failed, entered data is incorrect.",
          422,
          errors.array()
        );
      const email = req.body.email;
      const name = req.body.name;
      const password = await bcrypt.hash(req.body.password, 12);
      const user = new User({ email, password, name });
      await user.save();
      res
        .status(201)
        .json({ message: "User successfully created", userId: user._id });
    } catch (error) {
      Utils.errorHandler(next, error);
    }
  };

  export const postLogin: RequestHandler = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        Utils.throwNewError(
          "Validation failed, entered data is incorrect.",
          422,
          errors.array()
        );
      const email = req.body.email;
      const user = await User.findOne({ email });
      if (!user) Utils.throwNewError("Unable to find the requested user", 401);
      const areCredentialsValid = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!areCredentialsValid)
        Utils.throwNewError("Unable to find the requested user", 401);
      const userId = user._id.toString();
      const token = jwt.sign({ email, userId }, process.env.JWT_KEY, {
        expiresIn: "1h",
      });
      res.status(200).json({ token, userId });
    } catch (error) {
      Utils.errorHandler(next, error);
    }
  };
}
