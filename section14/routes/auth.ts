import express from "express";
import AuthController from "../controllers/auth";

const router = express.Router();

router.get("/login", AuthController.getLogin);

router.post("/login", AuthController.postLogin);

export default router;
