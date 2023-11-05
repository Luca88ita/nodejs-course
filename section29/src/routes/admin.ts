import express from "express";
import AdminController from "../controllers/admin";

import { isAuth } from "../middleware/is-auth";
import { body } from "express-validator";

const router = express.Router();

router.get("/add-product", isAuth, AdminController.getAddProduct);

router.get("/products", AdminController.getProducts);

router.post(
  "/add-product",
  isAuth,
  [
    body(
      "title",
      "The title must be alfanumeric and its length must be within 5 and 40 characters"
    )
      .isString()
      .trim()
      .isLength({ min: 5, max: 40 }),
    //body("imageUrl", "You must submit a valid URL").isURL(),
    body("image", "Invalid image").isBase64(),
    body(
      "description",
      "The description must be long between 20 and 500 characters"
    )
      .isLength({ min: 20, max: 500 })
      .trim(),
    body("price", "The price must be a number").isFloat({ min: 0.01 }),
  ],
  AdminController.postAddProduct
);

router.get("/edit-product/:productId", isAuth, AdminController.getEditProduct);

router.post(
  "/edit-product",
  isAuth,
  [
    body(
      "title",
      "The title must be alfanumeric and its length must be within 5 and 40 characters"
    )
      .isString()
      .trim()
      .isLength({ min: 5, max: 40 }),
    //body("imageUrl", "You must submit a valid URL").isURL(),
    body(
      "description",
      "The description must be long between 20 and 500 characters"
    )
      .isLength({ min: 20, max: 500 })
      .trim(),
    body("price", "The price must be a positive number").isFloat({ min: 0.01 }),
  ],
  AdminController.postEditProduct
);

router.delete("/product/:productId", isAuth, AdminController.deleteProduct);

export default router;
