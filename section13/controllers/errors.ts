import { RequestHandler } from "express";

namespace ErrorController {
  export const pageNotFound: RequestHandler = (req, res, next) => {
    res
      .status(404)
      .render("errors/404", { pageTitle: "Page not found", path: "" });
  };

  export const itemNotFound: RequestHandler = (req, res, next) => {
    res
      .status(400)
      .render("errors/400", { pageTitle: "Bad Request", path: "" });
  };
}

export default ErrorController;
