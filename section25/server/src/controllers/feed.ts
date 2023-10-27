import { RequestHandler } from "express";
//import { posts } from "../data/dummy";
import { validationResult } from "express-validator";
import Post from "../models/post";
import { ExtendedError } from "../types/types";
import Utils from "../utils/utils";

export namespace FeedController {
  export const getPost: RequestHandler = (req, res, next) => {
    const postId = req.params.postId;
    Post.findById(postId)
      .then((post) => {
        if (!post)
          Utils.throwNewError("Unable to find the requested post", 404);
        res.status(200).json({ message: "Post fetched", post });
      })
      .catch((err) => {
        Utils.errorHandler(next, err);
      });
  };

  export const getPosts: RequestHandler = (req, res, next) => {
    Post.find()
      .then((posts) => {
        if (posts.length === 0)
          Utils.throwNewError("Unable to fetch the posts", 404);
        res.status(200).json({
          message: "Posts fetched successfully",
          posts,
        });
      })
      .catch((err) => {
        Utils.errorHandler(next, err);
      });
  };

  export const postPost: RequestHandler = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errContent = "Validation failed, entered data is incorrect.";
      const errStatusCode = 422;
      Utils.throwNewError(errContent, errStatusCode);
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
        Utils.errorHandler(next, err);
      });
  };
}
