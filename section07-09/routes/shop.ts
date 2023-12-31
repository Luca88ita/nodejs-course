import express from "express";
import ShopController from "../controllers/shop";

export const router = express.Router();

router.get("/", ShopController.getIndex);

router.get("/products", ShopController.getProducts);

router.get("/products/:productId", ShopController.getProduct);

router.get("/cart", ShopController.getCart);

router.post("/cart", ShopController.postCart);

router.post("/cart-delete-item", ShopController.postCartDeleteItem);

router.get("/checkout", ShopController.getCheckout);

router.get("/orders", ShopController.getOrders);
