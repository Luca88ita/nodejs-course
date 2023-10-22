import { RequestHandler } from "express";
import bcrypt from "bcrypt";
import User, { IUser } from "../models/user";
import { RequestData } from "../util/types";

namespace AuthController {
  export const getLogin: RequestHandler = (req, res, next) => {
    res.render("auth/login", {
      pageTitle: "Login",
      path: "/login",
      errorMessage: req.flash("error"),
    });
  };

  export const postLogin: RequestHandler = (req: RequestData, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email })
      .then((user) => {
        if (!user) {
          req.flash("error", "Invalid email or password");
          return res.redirect("/login");
        }
        return bcrypt.compare(password, user.password).then((result) => {
          if (!result) {
            req.flash("error", "Invalid email or password");
            return res.redirect("/login");
          }
          req.session.user = user as IUser;
          req.session.isLoggedIn = result;
          return req.session.save((err) => {
            err && console.log(err);
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
      errorMessage: req.flash("error"),
    });
  };

  export const postSignup: RequestHandler = (req: RequestData, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    User.findOne({ email })
      .then((user) => {
        if (user) {
          req.flash("error", "E-mail address already exists");
          return res.redirect("/signup");
        }
        if (!password) {
          req.flash("error", "Please enter a password");
          return res.redirect("/signup");
        }
        if (password !== confirmPassword) {
          req.flash("error", "Please re-enter the same password");
          return res.redirect("/signup");
        }
        return bcrypt
          .hash(password, 12)
          .then((hashedpw) => {
            const newUser = new User({
              email,
              password: hashedpw,
              cart: { items: [] },
            });
            return newUser.save();
          })
          .then((err) => {
            err && console.log(err);
            res.redirect("login");
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  export const postLogout: RequestHandler = (req: RequestData, res, next) => {
    req.session.destroy((err) => {
      err && console.log(err);
      res.redirect("/");
    });
  };
}

export default AuthController;
