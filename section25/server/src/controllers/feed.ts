import { RequestHandler } from "express";
import { posts } from "../data/dummy";
import { validationResult } from "express-validator";

export namespace FeedController {
  export const getPosts: RequestHandler = (req, res, next) => {
    res.json({
      posts: posts,
    });
  };

  export const postPost: RequestHandler = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res
        .status(422)
        .json({
          message: "Validation failed, entered data is incorrect.",
          errors: errors.array(),
        });
    const title = req.body.title;
    const content = req.body.content;
    res.status(201).json({
      message: "post successfully created",
      post: {
        _id: Date.now(),
        title,
        content,
        creator: { name: "Luca" },
        createdAt: "2023-10-26",
      },
    });
  };
}
