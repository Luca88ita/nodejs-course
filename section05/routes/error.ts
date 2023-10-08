import express from "express";
import path from "path";
import { mainPath } from "../util/path";

export const router = express.Router();

router.use((req, res, next) => {
  res
    .status(404)
    .sendFile(path.join(mainPath as string, "views", "error.html"));
});
