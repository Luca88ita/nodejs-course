import express from "express";
import AdminController from "../controllers/admin";
import { isAuth } from "../middleware/is-auth";

const router = express.Router();

router.get("/add-product", isAuth, AdminController.getAddProduct);

router.get("/products", AdminController.getProducts);

router.post("/add-product", isAuth, AdminController.postAddProduct);

router.get("/edit-product/:productId", isAuth, AdminController.getEditProduct);

router.post("/edit-product", isAuth, AdminController.postEditProduct);

router.post("/delete-product", isAuth, AdminController.postDeleteProduct);

export default router;
