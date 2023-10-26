import { RequestHandler } from "express";
import { posts } from "../data/dummy";

export namespace FeedController {
  export const getPosts: RequestHandler = (req, res, next) => {
    res.json({
      posts: posts,
    });
  };

  export const postPost: RequestHandler = (req, res, next) => {
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
