import express from "express";
import { FeedController } from "../controllers/feed";

const router = express.Router();

router.get("/posts", FeedController.getPosts);

router.post("/post", FeedController.postPost);

export default router;
