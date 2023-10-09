import express from "express";
import { pageNotFound } from "../controllers/errors";

export const router = express.Router();

router.use(pageNotFound);
