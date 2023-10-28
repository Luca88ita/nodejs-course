import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import Post from "../models/post";
import Utils from "../utils/utils";

export namespace FeedController {
  // getting a single post
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

  // getting all the posts
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

  // updating a single post
  export const putPost: RequestHandler = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      Utils.throwNewError("Validation failed, entered data is incorrect.", 422);
    const postId = req.params.postId;
    const title = req.body.title;
    const content = req.body.content;
    const imageUrl = req.file ? req.file.path.replaceAll("\\", "/") : null;
    Post.findById(postId)
      .then((post) => {
        if (!post)
          Utils.throwNewError("Unable to find the requested post", 404);
        if (imageUrl) {
          Utils.clearImage(post.imageUrl);
          post.imageUrl = imageUrl;
        }
        post.title = title;
        post.content = content;
        return post.save();
      })
      .then((resp) => {
        res.status(200).json({ message: "Post updated", post: resp });
      })
      .catch((err) => {
        Utils.errorHandler(next, err);
      });
  };

  // deleting a single post
  export const deletePost: RequestHandler = (req, res, next) => {
    const postId = req.params.postId;
    Post.findById(postId)
      .then((post) => {
        if (!post)
          Utils.throwNewError("Unable to find the requested post", 404);
        const imageUrl = post.imageUrl;
        if (!imageUrl) Utils.throwNewError("No file picked", 422);
        Utils.clearImage(imageUrl);
        return post.deleteOne();
      })
      .then(() => {
        res.status(200).json({ message: "Post deleted" });
      })
      .catch((err) => {
        Utils.errorHandler(next, err);
      });
  };

  // creating a single post
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
    if (!req.file) Utils.throwNewError("No image provided", 422);
    const title = req.body.title;
    const content = req.body.content;
    const imageUrl = req.file.path.replaceAll("\\", "/");
    const post = new Post({
      title,
      content,
      creator: { name: "Luca" },
      imageUrl,
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
