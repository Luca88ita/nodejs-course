import express from "express";
import { AuthController } from "../controllers/auth";
import { body } from "express-validator";
import User from "../models/user";
import { isAuth } from "../middleware/is-auth";

const router = express.Router();

/* 
router.get("status", isAuth, AuthController.getStatus);

router.post(
  "status",
  [
    body("status")
      .isString()
      .withMessage("Invalid status format")
      .trim()
      .not()
      .isEmpty(),
  ],
  isAuth,
  AuthController.postStatus
);
 */
// POST /auth/login
router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email address")
      .normalizeEmail(),
    body(
      "password",
      "Please enter a valid password (a password must have one uppercase, one lower case, one special char, one digit and be long between 8 and 20 characters)"
    )
      .trim()
      .isLength({ min: 8, max: 20 })
      .matches(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,20}$/),
  ],
  AuthController.postLogin
);

// PUT /auth/signup
router.put(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email address")
      .normalizeEmail()
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) return Promise.reject("E-mail address already exists!");
        });
      }),
    body(
      "password",
      "Please enter a valid password (a password must have one uppercase, one lower case, one special char, one digit and be long between 8 and 20 characters)"
    )
      .trim()
      .isLength({ min: 8, max: 20 })
      .matches(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,20}$/),
    body("name").isString().trim().not().isEmpty(),
  ],
  AuthController.signup
);

export default router;
