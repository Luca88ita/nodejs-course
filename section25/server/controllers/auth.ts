import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/user";
import Utils from "../utils/utils";

dotenv.config();

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

  export const postLogin: RequestHandler = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      Utils.throwNewError(
        "Validation failed, entered data is incorrect.",
        422,
        errors.array()
      );
    const email = req.body.email;
    let loadedUser: IUser;
    User.findOne({ email })
      .then((user) => {
        if (!user)
          Utils.throwNewError("Unable to find the requested user", 401);
        loadedUser = user;
        return bcrypt.compare(req.body.password, user.password);
      })
      .then((areCredentialsValid) => {
        if (!areCredentialsValid)
          Utils.throwNewError("Unable to find the requested user", 401);
        const userId = loadedUser._id.toString();
        const token = jwt.sign({ email, userId }, process.env.JWT_KEY, {
          expiresIn: "1h",
        });
        res.status(200).json({ token, userId });
      })
      .catch((err) => Utils.errorHandler(next, err));
  };
  /* 
  export const getStatus: RequestHandler = (req, res, next) => {
    //@ts-ignore
    const userId = req.userId;
    User.findById(userId)
      .then((user) => {
        if (!user)
          Utils.throwNewError("Unable to find the requested user", 401);
        return res
          .status(200)
          .json({ message: "Post fetched", status: user.status });
      })
      .catch((err) => Utils.errorHandler(next, err));
  };

  export const postStatus: RequestHandler = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      Utils.throwNewError(
        "Validation failed, entered data is incorrect.",
        422,
        errors.array()
      );
    //@ts-ignore
    const userId = req.userId;
    User.findById(userId)
      .then((user) => {
        if (!user)
          Utils.throwNewError("Unable to find the requested user", 401);
        //@ts-ignore
        user.status = req.status;
        return user.save();
      })
      .then((user) => {
        res
          .status(200)
          .json({ status: user.status, message: "Status correctly updated" });
      })
      .catch((err) => Utils.errorHandler(next, err));
  }; */
}
