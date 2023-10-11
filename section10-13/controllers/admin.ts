import { RequestHandler } from "express";

import Product from "../models/product";

import { UserRequest } from "../util/types";

namespace AdminController {
  export const getAddProduct: RequestHandler = (req, res, next) => {
    res.render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editing: false,
    });
  };

  export const postAddProduct: RequestHandler = (
    req: UserRequest,
    res,
    next
  ) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl
      ? req.body.imageUrl
      : "https://cdn.pixabay.com/photo/2016/03/31/20/51/book-1296045_960_720.png";
    const description = req.body.description
      ? req.body.description
      : "No description available";
    const price = +req.body.price;
    /* req.user &&
      req.user.({
          title,
          imageUrl,
          description,
          price,
          //userId: req.user.id,
        }) */
    Product.create({
      title,
      imageUrl,
      description,
      price,
      //@ts-ignore
      userId: req.user.id,
    })
      .then(() => {
        console.log("Product added successfully");
        return res.redirect("/admin/products");
      })
      .catch((err) => console.log(err));
  };

  export const getEditProduct: RequestHandler = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) return res.redirect("/");
    const productId = req.params.productId;
    Product.findByPk(productId).then((product) => {
      if (!product) return res.redirect("/errors/400");
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
    Product.findByPk(productId)
      .then((product): Promise<any> | void => {
        if (!product) return res.redirect("/errors/400");
        product.title = req.body.title;
        product.price = +req.body.price;
        product.imageUrl = req.body.imageUrl;
        product.description = req.body.description;
        return product.save();
      })
      .then((result) => {
        console.log("Product info updated succesfully!");
        return res.redirect("/messages/edit-success");
      })
      .catch((err) => console.log(err));
  };

  export const postDeleteProduct: RequestHandler = (req, res, next) => {
    const productId = req.body.productId;
    /*Product.deleteById(productId);
    res.redirect("/admin/products");*/
    Product.findByPk(productId)
      .then((product): Promise<any> | void => {
        if (!product) return res.redirect("/errors/400");
        return product.destroy();
      })
      .then((result) => {
        console.log("Product deleted succesfully!");
        return res.redirect("/messages/delete-success");
      })
      .catch((err) => console.log(err));
  };

  export const getProducts: RequestHandler = (req, res, next) => {
    Product.findAll()
      .then((products) => {
        res.render("admin/products", {
          prods: products,
          pageTitle: "Admin Products",
          path: "/admin/products",
        });
      })
      .catch((err) => console.log(err));
  };
}

export default AdminController;
