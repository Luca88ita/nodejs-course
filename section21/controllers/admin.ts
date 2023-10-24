import { RequestHandler } from "express";
import dotenv from "dotenv";
import { ExtendedError, RequestData } from "../util/types";
import Product from "../models/product";
import { validationResult } from "express-validator";
import FileHelper from "../util/file";

namespace AdminController {
  export const getAddProduct: RequestHandler = (
    req: RequestData,
    res,
    next
  ) => {
    res.render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editing: false,
      errorMessage: "",
      hasError: false,
      validationErrors: [],
      product: { title: "", imageUrl: "", description: "", price: 0 },
    });
  };

  export const postAddProduct: RequestHandler = (
    req: RequestData,
    res,
    next
  ) => {
    const title = req.body.title;
    /*const imageUrl = req.body.imageUrl
      ? req.body.imageUrl
      : "https://cdn.pixabay.com/photo/2016/03/31/20/51/book-1296045_960_720.png";*/
    const image = req.file;
    const description = req.body.description
      ? req.body.description
      : "No description available";
    const price = +req.body.price;
    const errors = validationResult(req);
    if (!image)
      return res.status(422).render("admin/edit-product", {
        pageTitle: "Add Product",
        path: "/admin/add-product",
        editing: false,
        errorMessage: "The attached file is not a valid image",
        hasError: true,
        validationErrors: [{ path: "image" }],
        product: {
          title,
          description: req.body.description,
          price,
        },
      });
    const imageUrl = image.path;
    if (!errors.isEmpty())
      return res.status(422).render("admin/edit-product", {
        pageTitle: "Add Product",
        path: "/admin/add-product",
        editing: false,
        errorMessage: errors.array()[0].msg,
        hasError: true,
        validationErrors: errors.array(),
        product: {
          title,
          image,
          description: req.body.description,
          price,
        },
      });
    const product = new Product({
      title,
      price,
      description,
      imageUrl,
      _userId: req.user,
    });
    product
      .save()
      .then(() => {
        console.log("Product added successfully");
        return res.redirect("/admin/products");
      })
      .catch((err) => {
        /* return res.status(500).render("admin/edit-product", {
          pageTitle: "Add Product",
          path: "/admin/add-product",
          editing: false,
          errorMessage: "Database operation failed, please try again.",
          hasError: true,
          validationErrors: [],
          product: {
            title,
            imageUrl: req.body.imageUrl,
            description: req.body.description,
            price,
          },
        }); */
        //res.redirect("/500");
        const error: ExtendedError = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  };

  export const getEditProduct: RequestHandler = (
    req: RequestData,
    res,
    next
  ) => {
    const editMode = req.query.edit;
    if (!editMode) return res.redirect("/");
    const productId = req.params.productId;

    Product.findOne({ _id: productId, _userId: req.user?._id })
      .then((product) => {
        if (!product) return res.redirect("/400");
        res.render("admin/edit-product", {
          pageTitle: "Edit Product",
          path: "/admin/edit-product",
          editing: editMode,
          errorMessage: "",
          hasError: false,
          validationErrors: [],
          product,
        });
      })
      .catch((err) => {
        const error: ExtendedError = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  };

  export const postEditProduct: RequestHandler = (
    req: RequestData,
    res,
    next
  ) => {
    const productId = req.body.productId;

    const title = req.body.title;
    const image = req.file;
    const description = req.body.description;
    const price = +req.body.price;
    const imageUrl = image && image.path;
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: true,
        errorMessage: errors.array()[0].msg,
        hasError: true,
        validationErrors: errors.array(),
        product: {
          _id: productId,
          title,
          description,
          price,
        },
      });

    Product.findOne({ _id: productId, _userId: req.user?._id })
      .then((product): void | Promise<void> => {
        if (!product) return res.redirect("/400");
        product.title = title;
        product.price = price;
        product.description = description;
        if (imageUrl) {
          FileHelper.deleteFile(product.imageUrl);
          product.imageUrl = imageUrl;
        }
        return product.save().then((result) => {
          console.log("Product info updated succesfully!");
          return res.redirect("/messages/edit-success");
        });
      })
      .catch((err) => {
        const error: ExtendedError = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  };

  export const postDeleteProduct: RequestHandler = (
    req: RequestData,
    res,
    next
  ) => {
    const productId = req.body.productId;
    Product.findOne({ _id: productId, _userId: req.user?._id })
      .then((product): any => {
        if (!product) return next(new Error("Product not found"));
        FileHelper.deleteFile(product.imageUrl);
        return product.deleteOne();
      })
      .then(() => {
        console.log("Product deleted succesfully!");
        return res.redirect("/messages/delete-success");
      })
      .catch((err) => {
        const error: ExtendedError = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  };

  export const getProducts: RequestHandler = (req: RequestData, res, next) => {
    const page: number = req.query.page ? +req.query.page : 1;
    const itemsPerPage = +process.env.ITEMS_PER_PAGE!;
    let totalProducts: number = 0;

    Product.find({ _userId: req.user?._id })
      .countDocuments()
      .then((prodNumber) => {
        totalProducts = prodNumber;
        return Product.find({ _userId: req.user?._id })
          .skip((page - 1) * itemsPerPage)
          .limit(itemsPerPage);
      })
      //the code commented below is only here as example
      /* .select("title price -imageUrl")
      .populate("_userId", "name") */
      .then((products) => {
        if (!products || products.length <= 0) return res.redirect("/400");
        res.render("admin/products", {
          pageTitle: "Admin Products",
          path: "/admin/products",
          products,
          totalProducts,
          currentPage: page,
          hasNextPage: itemsPerPage * page < totalProducts,
          hasPreviousPage: page > 1,
          nextPage: page + 1,
          previousPage: page - 1,
          lastPage: Math.ceil(totalProducts / itemsPerPage),
        });
      })
      .catch((err) => {
        const error: ExtendedError = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  };
}

export default AdminController;
