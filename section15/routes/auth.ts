import express from "express";
import { body, check } from "express-validator";
import AuthController from "../controllers/auth";

const router = express.Router();

router.get("/login", AuthController.getLogin);

router.post("/login", AuthController.postLogin);

router.get("/signup", AuthController.getSignup);

router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .custom((value, { req }) => {
        if (value === "456@456.com")
          throw new Error("This email address is forbidden");
        return true;
      }),
    body(
      "password",
      "Password should have one uppercase, one lower case, one special char, one digit and be long between 8 and 20 characters"
    )
      .isLength({ min: 8, max: 20 })
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i"),
    body("confirmPassword").custom((value, { req }) => {
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
