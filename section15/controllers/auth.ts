import { RequestHandler } from "express";
import User, { IUser } from "../models/user";
import { userId } from "../app";
import { RequestData } from "../util/types";

namespace AuthController {
  export const getLogin: RequestHandler = (req, res, next) => {
    res.render("auth/login", {
      pageTitle: "Login",
      path: "/login",
      isAuthenticated: false,
    });
  };

  export const postLogin: RequestHandler = (req: RequestData, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    const validCredentials = email === "123@123.it" && password === "123";

    User.findById(userId)
      .then((user) => {
        req.session.user = user as IUser;
        req.session.isLoggedIn = validCredentials && true;

        //req.user = req.session.user;
        req.session.save((err) => {
          console.log(err);
          validCredentials && user
            ? res.redirect("/")
            : res.redirect("/errors/404");
        });
      })
      .catch((err) => console.log(err));
  };

  export const getSignup: RequestHandler = (req, res, next) => {
    res.render("auth/signup", {
      pageTitle: "Signup",
      path: "/signup",
      isAuthenticated: false,
    });
  };

  export const postSignup: RequestHandler = (req: RequestData, res, next) => {
    console.log("singup");
  };

  export const postLogout: RequestHandler = (req: RequestData, res, next) => {
    req.session.destroy((err) => {
      console.log(err);
      res.redirect("/");
    });
  };
}

export default AuthController;
