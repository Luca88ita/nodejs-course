import { RequestHandler } from "express";
import { UserRequest } from "../util/types";
import Product from "../models/product";

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
    const product: Product = new Product(title, price, description, imageUrl);
    product.save();
    /* req
      .user!.createProduct({
        title,
        imageUrl,
        description,
        price,
      })
      .then(() => {
        console.log("Product added successfully");
        return res.redirect("/admin/products");
      })
      .catch((err) => console.log(err)); */
  };

  export const getEditProduct: RequestHandler = (
    req: UserRequest,
    res,
    next
  ) => {
    const editMode = req.query.edit;
    if (!editMode) return res.redirect("/");
    const productId = req.params.productId;
    /* req.user!.getProducts({ where: { id: productId } }).then((products) => {
      const product = products[0];
      if (!product) return res.redirect("/errors/400");
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product,
      });
    }); */
  };

  export const postEditProduct: RequestHandler = (
    req: UserRequest,
    res,
    next
  ) => {
    const productId = req.body.productId;
    /*  req
      .user!.getProducts({ where: { id: productId } })
      .then((products): Promise<any> | void => {
        const product = products[0];
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
      .catch((err) => console.log(err)); */
  };

  export const postDeleteProduct: RequestHandler = (
    req: UserRequest,
    res,
    next
  ) => {
    const productId = req.body.productId;
    /* req
      .user!.getProducts({ where: { id: productId } })
      .then((products): Promise<any> | void => {
        const product = products[0];
        if (!product) return res.redirect("/errors/400");
        return product.destroy();
      })
      .then((result) => {
        console.log("Product deleted succesfully!");
        return res.redirect("/messages/delete-success");
      })
      .catch((err) => console.log(err)); */
  };

  export const getProducts: RequestHandler = (req: UserRequest, res, next) => {
    /* req
      .user!.getProducts()
      .then((products) => {
        if (products.length <= 0) return res.redirect("/errors/400");
        res.render("admin/products", {
          pageTitle: "Admin Products",
          path: "/admin/products",
          products,
        });
      })
      .catch((err) => console.log(err)); */
  };
}

export default AdminController;
