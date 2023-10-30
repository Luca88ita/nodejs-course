import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import Post from "../models/post";
import Utils from "../utils/utils";
import User from "../models/user";
import { socketService } from "../socket";

export namespace FeedController {
  // getting a single post
  export const getPost: RequestHandler = async (req, res, next) => {
    try {
      const postId = req.params.postId;
      const post = await Post.findById(postId).populate("creator", "name");
      if (!post) Utils.throwNewError("Unable to find the requested post", 404);
      res.status(200).json({ message: "Post fetched", post });
    } catch (error) {
      Utils.errorHandler(next, error);
    }
  };

  // getting all the posts
  export const getPosts: RequestHandler = async (req, res, next) => {
    try {
      const currentPage = +req.query.page || 1;
      const postPerPage = 2;
      const totalItems = await Post.find().countDocuments();
      if (totalItems === 0)
        Utils.throwNewError("Unable to fetch the posts", 404);
      const posts = await Post.find()
        .populate("creator", "name")
        .sort({ createdAt: -1 })
        .skip((currentPage - 1) * postPerPage)
        .limit(postPerPage);
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
  export const putPost: RequestHandler = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        Utils.throwNewError(
          "Validation failed, entered data is incorrect.",
          422
        );
      const postId = req.params.postId;
      const title = req.body.title;
      const content = req.body.content;
      const imageUrl = req.file ? req.file.path.replaceAll("\\", "/") : null;
      const post = await Post.findById(postId).populate("creator", "name");
      if (!post) Utils.throwNewError("Unable to find the requested post", 404);

      if (post.creator._id.toString() !== req.userId)
        Utils.throwNewError("Unauthorized to edit the requested post", 403);
      if (imageUrl) {
        Utils.clearImage(post.imageUrl);
        post.imageUrl = imageUrl;
      }
      post.title = title;
      post.content = content;
      const result = await post.save();
      socketService.getIO().emit("posts", { action: "update", post: result });
      res.status(200).json({ message: "Post updated", post });
    } catch (error) {
      Utils.errorHandler(next, error);
    }
  };

  // deleting a single post
  export const deletePost: RequestHandler = async (req, res, next) => {
    try {
      const postId = req.params.postId;
      const post = await Post.findById(postId).populate("creator", "name");
      if (!post) Utils.throwNewError("Unable to find the requested post", 404);
      if (post.creator._id.toString() !== req.userId)
        Utils.throwNewError("Unauthorized to edit the requested post", 403);
      const imageUrl = post.imageUrl;
      if (!imageUrl) Utils.throwNewError("No file picked", 422);
      Utils.clearImage(imageUrl);
      const deletedPost = await post.deleteOne();
      const user = await User.findById(req.userId);
      user.posts.pull(postId);
      await user.save();
      socketService
        .getIO()
        .emit("posts", { action: "delete", post: deletedPost });
      res.status(200).json({ message: "Post deleted" });
    } catch (error) {
      Utils.errorHandler(next, error);
    }
  };

  // creating a single post
  export const postPost: RequestHandler = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        Utils.throwNewError(
          "Validation failed, entered data is incorrect.",
          422
        );
      if (!req.file) Utils.throwNewError("No image provided", 422);
      const title = req.body.title;
      const content = req.body.content;
      const imageUrl = req.file.path.replaceAll("\\", "/");
      const post = new Post({
        title,
        content,
        creator: req.userId,
        imageUrl,
      });
      await post.save();
      const user = await User.findById(req.userId);
      const creator = { _id: user._id, name: user.name };
      user.posts.push(post);
      await user.save();
      socketService
        .getIO()
        .emit("posts", { action: "create", post: { ...post._doc, creator } });
      res.status(201).json({
        message: "post successfully created",
        post,
        creator,
      });
    } catch (error) {
      Utils.errorHandler(next, error);
    }
  };
}
