import express from "express";
import { UserController } from "../controllers/user";
import { body } from "express-validator";
import { isAuth } from "../middleware/is-auth";

const router = express.Router();

router.get("/status", isAuth, UserController.getStatus);

router.patch(
  "/status",
  [
    body("status")
      .isString()
      .withMessage("Invalid status format")
      .trim()
      .not()
      .isEmpty(),
  ],
  isAuth,
  UserController.postStatus
);

export default router;
