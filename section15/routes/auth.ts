import express from "express";
import AuthController from "../controllers/auth";

const router = express.Router();

router.get("/login", AuthController.getLogin);

router.post("/login", AuthController.postLogin);

router.get("/signup", AuthController.getSignup);

router.post("/signup", AuthController.postSignup);

router.post("/logout", AuthController.postLogout);

router.get("/reset", AuthController.getReset);

router.post("/reset", AuthController.postReset);

router.get("/reset/:token", AuthController.getNewPassword);

router.post("/new-password", AuthController.postNewPassword);

export default router;
