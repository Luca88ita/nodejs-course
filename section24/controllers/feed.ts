import { RequestHandler } from "express";

export namespace FeedController {
  export const getPosts: RequestHandler = (req, res, next) => {
    res.json({
      posts: [
        { title: "first post", content: "this is the first post" },
        { title: "Second post", content: "this is the second post" },
        { title: "Third post", content: "this is the third post" },
      ],
    });
  };

  export const postPost: RequestHandler = (req, res, next) => {
    const title = req.body.title;
    const content = req.body.content;
    res.status(201).json({
      message: "post successfully created",
      post: { _id: Date.now(), title, content },
    });
  };
}
