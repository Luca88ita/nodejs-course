import express from "express";
import { body, check } from "express-validator";
import AuthController from "../controllers/auth";
import User from "../models/user";

const router = express.Router();

router.get("/login", AuthController.getLogin);

router.post(
  "/login",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .normalizeEmail(),
    body(
      "password",
      "Please enter a valid password (a password must have one uppercase, one lower case, one special char, one digit and be long between 8 and 20 characters)"
    )
      .matches(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,20}$/)
      .trim(),
  ],
  AuthController.postLogin
);

router.get("/signup", AuthController.getSignup);

router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .custom((value, { req }) => {
        /* if (value === "456@456.com")
          throw new Error("This email address is forbidden");
        return true; */
        //the code below is here as example, but would be better to keep it in the controller
        return User.findOne({ email: value }).then((user) => {
          if (user) {
            return Promise.reject(
              "This e-mail address already exists, please login or signup with a different one"
            );
          }
        });
      })
      .normalizeEmail(),
    body(
      "password",
      "Password must have one uppercase, one lower case, one special char, one digit and be long between 8 and 20 characters"
    )
      .isLength({ min: 8, max: 20 })
      .matches(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,20}$/)
      .trim(),
    body("confirmPassword")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password)
          throw new Error(
            "Passwords have to match. Please re-enter the same password"
          );
        return true;
      }),
  ],
  AuthController.postSignup
);

router.post("/logout", AuthController.postLogout);

router.get("/reset", AuthController.getReset);

router.post("/reset", AuthController.postReset);

router.get("/reset/:token", AuthController.getNewPassword);

router.post("/new-password", AuthController.postNewPassword);

export default router;
