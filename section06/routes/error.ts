import express from "express";
import path from "path";
import { mainPath } from "../util/path";

export const router = express.Router();

router.use((req, res, next) => {
  res.status(404).render("404", { pageTitle: "Page not found", path: "" });
  //res.status(404).sendFile(path.join(mainPath as string, "views", "404.html"));
});
