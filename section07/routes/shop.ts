import express from "express";
import { getProducts } from "../controllers/products";

export const router = express.Router();

router.get("/", getProducts);
