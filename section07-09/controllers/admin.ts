import { Product } from "../models/product";

import { RequestHandler } from "express";

namespace AdminController {
  export const getAddProduct: RequestHandler = (req, res, next) => {
    res.render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editing: false,
    });
  };

  export const postAddProduct: RequestHandler = (req, res, next) => {
    const product = new Product(
      req.body.title,
      req.body.imageUrl,
      req.body.description,
      +req.body.price
    );
    product.save();
    res.redirect("/");
  };

  export const getEditProduct: RequestHandler = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) return res.redirect("/");
    const productId = req.params.productId;
    Product.findById(productId, (product) => {
      if (!product) return res.redirect("/");
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product,
      });
    });
  };

  export const postEditProduct: RequestHandler = (req, res, next) => {
    const productId = req.body.productId;
    const updatedProduct = new Product(
      req.body.title,
      req.body.imageUrl,
      req.body.description,
      +req.body.price,
      req.body.productId
    );
    updatedProduct.save();
  };

  export const postDeleteProduct: RequestHandler = (req, res, next) => {
    const productId = req.body.productId;
    Product.deleteById(productId);
    res.redirect("/admin/products");
  };

  export const getProducts: RequestHandler = (req, res, next) => {
    Product.fetchAll((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    });
  };
}

export default AdminController;
