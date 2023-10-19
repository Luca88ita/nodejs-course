import { RequestHandler, Response } from "express";

namespace AuthController {
  export const getLogin: RequestHandler = (req, res, next) => {
    const isLoggedIn =
      req.get("Cookie")?.split(";")[0].trim().split("=")[1] === "true";

    res.render("auth/login", {
      pageTitle: "Login",
      path: "/login",
      isAuthenticated: isLoggedIn,
    });
  };

  export const postLogin: RequestHandler = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    const validCredentials = email === "123@123.it" && password === "123";
    validCredentials && res.setHeader("Set-Cookie", "loggedIn=true");
    //@ts-ignore
    //res.session.isLoggedIn = validCredentials && true;
    return validCredentials ? res.redirect("/") : res.redirect("/errors/404");
  };
}

export default AuthController;
