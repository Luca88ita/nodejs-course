import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import Post from "../models/post";
import Utils from "../utils/utils";
import User from "../models/user";

export namespace FeedController {
  // getting a single post
  export const getPost: RequestHandler = (req, res, next) => {
    const postId = req.params.postId;
    Post.findById(postId)
      .populate("creator", "name")
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
  export const getPosts: RequestHandler = async (req, res, next) => {
    const currentPage = +req.query.page || 1;
    const postPerPage = 2;
    try {
      const totalItems = await Post.find().countDocuments();
      const posts = await Post.find()
        .populate("creator", "name")
        .skip((currentPage - 1) * postPerPage)
        .limit(postPerPage);

      if (posts.length === 0)
        Utils.throwNewError("Unable to fetch the posts", 404);
      res.status(200).json({
        message: "Posts fetched successfully",
        posts,
        totalItems,
      });
    } catch (error) {
      Utils.errorHandler(next, error);
    }
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
        //@ts-ignore
        if (post.creator.toString() !== req.userId)
          Utils.throwNewError("Unauthorized to edit the requested post", 403);
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
        //@ts-ignore
        if (post.creator.toString() !== req.userId)
          Utils.throwNewError("Unauthorized to edit the requested post", 403);
        const imageUrl = post.imageUrl;
        if (!imageUrl) Utils.throwNewError("No file picked", 422);
        Utils.clearImage(imageUrl);
        return post.deleteOne();
      })
      .then((result) => {
        //@ts-ignore
        return User.findById(req.userId);
      })
      .then((user) => {
        user.posts.pull(postId);
        return user.save();
      })
      .then((result) => {
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
    let creator;
    const post = new Post({
      title,
      content,
      //@ts-ignore
      creator: req.userId,
      imageUrl,
    });
    post
      .save()
      .then((result) => {
        //@ts-ignore
        return User.findById(req.userId);
      })
      .then((user) => {
        creator = { _id: user._id, name: user.name };
        user.posts.push(post);
        return user.save();
      })
      .then((result) => {
        res.status(201).json({
          message: "post successfully created",
          post,
          creator,
        });
      })
      .catch((err) => {
        Utils.errorHandler(next, err);
      });
  };

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
