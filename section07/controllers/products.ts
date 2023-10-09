import { Product } from "../models/product";

import { RequestHandler } from "express";

export const getAddProduct: RequestHandler = (req, res, next) => {
  res.render("add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    activeAddProduct: true,
    formCSS: true,
    productCSS: true,
  });
};

export const postAddProduct: RequestHandler = (req, res, next) => {
  const product = new Product(req.body.title);
  product.save();
  res.redirect("/");
};

export const getProducts: RequestHandler = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop", {
      prods: products,
      pageTitle: "Shop",
      path: "/",
    });
  });
};
