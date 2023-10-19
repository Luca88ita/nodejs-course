import { RequestHandler } from "express";
import { UserRequest } from "../util/types";

namespace ErrorController {
  export const pageNotFound: RequestHandler = (req: UserRequest, res, next) => {
    res
      .status(404)
      .render("errors/404", {
        pageTitle: "Page not found",
        path: "",
        isAuthenticated: req.isLoggedIn,
      });
  };

  export const itemNotFound: RequestHandler = (req: UserRequest, res, next) => {
    res
      .status(400)
      .render("errors/400", {
        pageTitle: "Bad Request",
        path: "",
        isAuthenticated: req.isLoggedIn,
      });
  };
}

export default ErrorController;
