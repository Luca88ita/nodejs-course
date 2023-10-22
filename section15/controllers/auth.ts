import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import crypto from "crypto";
import bcrypt from "bcrypt";
import User, { IUser } from "../models/user";
import { RequestData } from "../util/types";
import { sendEmail } from "../util/mailTransporter";

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
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).render("auth/signup", {
        pageTitle: "Signup",
        path: "/signup",
        errorMessage: errors.array()[0].msg,
      });
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
            res.redirect("login");
            // better if this part of code is not blocking otherwise for larger scale apps it may slow down the server
            return sendEmail(
              email,
              '"noreply@yourdomain.com" <noreply@yourdomain.com>',
              "Signup succeeded",
              "signup-success"
            );
          })
          .catch((err) => {
            console.log(err);
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

  export const getReset: RequestHandler = (req, res, next) => {
    res.render("auth/reset", {
      pageTitle: "Reset Password",
      path: "/reset",
      errorMessage: req.flash("error"),
    });
  };

  export const postReset: RequestHandler = (req: RequestData, res, next) => {
    const email = req.body.email;

    crypto.randomBytes(32, (err, buffer) => {
      if (err) {
        console.log(err);
        return res.redirect("/reset");
      }
      const token = buffer.toString("hex");
      User.findOne({ email })
        .then((user): void | Promise<void> => {
          if (!user) {
            req.flash(
              "error",
              `No account with registered with this email: ${email}`
            );
            return res.redirect("/reset");
          }
          user.resetToken = token;
          user.resetTokenExpiration = Date.now() + 60 * 60 * 1000;
          return user.save().then(() => {
            res.redirect("/login");
            sendEmail(
              email,
              '"noreply-password-reset@yourdomain.com" <noreply-password-reset@yourdomain.com>',
              "Password reset",
              "password-reset",
              `http://localhost:3000/reset/${token}`
            );
          });
        })
        .catch((err) => {
          console.log(err);
        });
    });
  };

  export const getNewPassword: RequestHandler = (req, res, next) => {
    const resetToken = req.params.token;
    User.findOne({ resetToken, resetTokenExpiration: { $gt: Date.now() } })
      .then((user) => {
        if (!user) {
          req.flash(
            "error",
            `The token is not valid anymore. Please request a new one`
          );
          return res.redirect("/reset");
        }
        return res.render("auth/new-password", {
          pageTitle: "New Password",
          path: "/new-password",
          errorMessage: req.flash("error"),
          userId: user._id.toString(),
          token: resetToken,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  export const postNewPassword: RequestHandler = (
    req: RequestData,
    res,
    next
  ) => {
    const password = req.body.password;
    const userId = req.body.userId;
    const resetToken = req.body.token;
    User.findOne({
      _id: userId,
      resetToken,
      resetTokenExpiration: { $gt: Date.now() },
    })
      .then((user) => {
        if (!user) {
          req.flash(
            "error",
            `The token is not valid anymore. Please request a new one`
          );
          return res.redirect("/reset");
        }

        return bcrypt
          .hash(password, 12)
          .then((hashedpw) => {
            user.password = hashedpw;
            user.resetToken = undefined;
            user.resetTokenExpiration = undefined;
            return user.save();
          })
          .then((err) => {
            res.redirect("/login");
            // better if this part of code is not blocking otherwise for larger scale apps it may slow down the server
            return sendEmail(
              user.email,
              '"noreply-password-reset@yourdomain.com" <noreply-password-reset@yourdomain.com>',
              "Password successfully changed",
              "reset-success",
              `http://localhost:3000/login`
            );
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };
}

export default AuthController;
