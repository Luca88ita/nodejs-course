import express from "express";
import path from "path";
import { mainPath } from "../util/path";

export const products: any[] = [];

export const router = express.Router();

router.get("/add-product", (req, res, next) => {
  res.render("add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    activeAddProduct: true,
    formCSS: true,
    productCSS: true,
  });
  //res.sendFile(path.join(mainPath as string, "views", "add-product.html"));
});

router.post("/add-product", (req, res, next) => {
  products.push({ title: req.body.title });
  res.redirect("/");
});
