import express from "express";
import ShopController from "../controllers/shop";
import { isAuth } from "../middleware/is-auth";

const router = express.Router();

router.get("/", ShopController.getIndex);

router.get("/products", ShopController.getProducts);

router.get("/products/:productId", ShopController.getProduct);

router.get("/cart", isAuth, ShopController.getCart);

router.post("/cart", isAuth, ShopController.postCart);

router.post("/cart-delete-item", isAuth, ShopController.postCartDeleteItem);

router.get("/checkout", isAuth, ShopController.getCheckout);

router.get("/orders", isAuth, ShopController.getOrders);

router.post("/create-order", isAuth, ShopController.postOrder);

export default router;
