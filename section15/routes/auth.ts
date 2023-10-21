import express from "express";
import AuthController from "../controllers/auth";

const router = express.Router();

router.get("/login", AuthController.getLogin);

router.post("/login", AuthController.postLogin);

router.get("/signup", AuthController.getSignup);

router.post("/signup", AuthController.postSignup);

router.post("/logout", AuthController.postLogout);

export default router;
