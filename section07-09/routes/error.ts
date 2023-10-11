import express from "express";
import ErrorController from "../controllers/errors";

export const router = express.Router();

router.get("/errors/400", ErrorController.itemNotFound);

router.use(ErrorController.pageNotFound);
