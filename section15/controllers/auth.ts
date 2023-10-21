import { RequestHandler } from "express";
import bcrypt from "bcrypt";
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

    User.findOne({ email })
      .then((user) => {
        return !user
          ? res.redirect("/login")
          : bcrypt.compare(password, user.password).then((result) => {
              if (!result) return res.redirect("/login");
              req.session.user = user as IUser;
              req.session.isLoggedIn = result;
              return req.session.save((err) => {
                console.log(err);
                res.redirect("/");
              });
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
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    User.findOne({ email })
      .then((user) => {
        return user
          ? res.redirect("/signup")
          : bcrypt
              .hash(password, 12)
              .then((hashedpw) => {
                const newUser = new User({
                  email,
                  password: hashedpw,
                  cart: { items: [] },
                });
                return newUser.save();
              })
              .then((result) => {
                res.redirect("login");
              });
      })
      .catch((err) => console.log(err));
  };

  export const postLogout: RequestHandler = (req: RequestData, res, next) => {
    req.session.destroy((err) => {
      console.log(err);
      res.redirect("/");
    });
  };
}

export default AuthController;
