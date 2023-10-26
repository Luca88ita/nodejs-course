import express from "express";
import { FeedController } from "../controllers/feed";

const router = express.Router();

// GET /feed/posts
router.get("/posts", FeedController.getPosts);

// POST /feed/post
router.post("/post", FeedController.postPost);

export default router;
