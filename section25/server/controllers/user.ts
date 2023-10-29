import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import Utils from "../utils/utils";
import User from "../models/user";

export namespace UserController {
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
    console.log(req.body);
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
        user.status = req.body.status;
        return user.save();
      })
      .then((user) => {
        res
          .status(200)
          .json({ status: user.status, message: "Status correctly updated" });
      })
      .catch((err) => Utils.errorHandler(next, err));
  };
}
