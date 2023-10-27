import express from "express";
import { FeedController } from "../controllers/feed";
import { body } from "express-validator";

const router = express.Router();

// GET /feed/posts
router.get("/posts", FeedController.getPosts);

// GET /feed/post/:postId
router.get("/post/:postId", FeedController.getPost);

// PUT /feed/post/:postId
router.put(
  "/post/:postId",
  [
    body("title").isString().trim().isLength({ min: 5, max: 60 }),
    body("content").isString().trim().isLength({ min: 5, max: 500 }),
  ],
  FeedController.putPost
);

// POST /feed/post
router.post(
  "/post",
  [
    body("title").isString().trim().isLength({ min: 5, max: 60 }),
    body("content").isString().trim().isLength({ min: 5, max: 500 }),
  ],
  FeedController.postPost
);

export default router;
