import express from "express";
import ErrorController from "../controllers/errors";

const router = express.Router();

router.get("/400", ErrorController.itemNotFound);

router.get("/500", ErrorController.get500);

router.get("/404", ErrorController.pageNotFound);

export default router;
