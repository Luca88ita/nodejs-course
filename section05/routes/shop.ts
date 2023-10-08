import express from "express";
import path from "path";
import { mainPath } from "../util/path";

export const router = express.Router();

router.get("/", (req, res, next) => {
  res.sendFile(path.join(mainPath as string, "views", "shop.html"));
});
