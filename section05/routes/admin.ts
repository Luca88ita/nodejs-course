import express from "express";
import path from "path";
import { mainPath } from "../util/path";

export const router = express.Router();

router.get("/add-product", (req, res, next) => {
  res.sendFile(path.join(mainPath as string, "views", "add-product.html"));
});

router.post("/add-product", (req, res, next) => {
  console.log(req.body);
  res.redirect("/");
});
