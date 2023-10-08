import express from "express";
import path from "path";
import { mainPath } from "../util/path";
import { products } from "./admin";

export const router = express.Router();

router.get("/", (req, res, next) => {
  res.render("shop", {
    prods: products,
    pageTitle: "Shop",
    path: "/",
    hasProducts: products.length > 0,
    activeShop: true,
    productCSS: true,
  });
  //res.sendFile(path.join(mainPath as string, "views", "shop.html"));
});
