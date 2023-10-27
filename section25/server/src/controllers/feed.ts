import { RequestHandler } from "express";
//import { posts } from "../data/dummy";
import { validationResult } from "express-validator";
import Post from "../models/post";
import { ExtendedError } from "../types/types";

export namespace FeedController {
  export const getPosts: RequestHandler = (req, res, next) => {
    Post.find().then((posts) => {
      if (posts.length === 0) return;
      res.json({
        posts,
      });
    });
  };

  export const postPost: RequestHandler = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = new Error("Validation failed, entered data is incorrect.");
      const error: ExtendedError = { ...err, statusCode: 422 };
      throw error;
      /* const error = new Error("Validation failed, entered data is incorrect.")
      return res.status(422).json({
        message: "Validation failed, entered data is incorrect.",
        errors: errors.array(),
      }); */
    }
    const title = req.body.title;
    const content = req.body.content;
    const post = new Post({
      title,
      content,
      creator: { name: "Luca" },
      imageUrl: "images/Book.png",
    });
    post
      .save()
      .then((result) => {
        res.status(201).json({
          message: "post successfully created",
          post: result,
        });
      })
      .catch((err) => {
        err.statusCode = !err.statusCode && 500;
        next(err);
      });
  };
}
