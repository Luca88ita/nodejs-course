import express from "express";
import { FeedController } from "../controllers/feed";
import { body } from "express-validator";
import { isAuth } from "../middleware/is-auth";

const router = express.Router();

// GET /feed/posts
router.get("/posts", isAuth, FeedController.getPosts);

// GET /feed/post/:postId
router.get("/post/:postId", isAuth, FeedController.getPost);

// PUT /feed/post/:postId
router.put(
  "/post/:postId",
  isAuth,
  [
    body("title").isString().trim().isLength({ min: 5, max: 60 }),
    body("content").isString().trim().isLength({ min: 5, max: 500 }),
  ],
  FeedController.putPost
);

// DELETE /feed/post/:postId
router.delete("/post/:postId", isAuth, FeedController.deletePost);

// POST /feed/post
router.post(
  "/post",
  isAuth,
  [
    body("title").isString().trim().isLength({ min: 5, max: 60 }),
    body("content").isString().trim().isLength({ min: 5, max: 500 }),
  ],
  FeedController.postPost
);

export default router;
