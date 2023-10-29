import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import Utils from "../utils/utils";
import User from "../models/user";

export namespace UserController {
  export const getStatus: RequestHandler = async (req, res, next) => {
    try {
      //@ts-ignore
      const userId = req.userId;
      const user = await User.findById(userId);
      if (!user) Utils.throwNewError("Unable to find the requested user", 401);
      res.status(200).json({ message: "Post fetched", status: user.status });
    } catch (error) {
      Utils.errorHandler(next, error);
    }
  };

  export const postStatus: RequestHandler = async (req, res, next) => {
    try {
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
      const user = await User.findById(userId);
      if (!user) Utils.throwNewError("Unable to find the requested user", 401);
      //@ts-ignore
      user.status = req.body.status;
      await user.save();
      res
        .status(200)
        .json({ status: user.status, message: "Status correctly updated" });
    } catch (error) {
      Utils.errorHandler(next, error);
    }
  };
}
