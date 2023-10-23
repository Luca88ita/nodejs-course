import { RequestHandler } from "express";
import { RequestData } from "../util/types";

namespace ErrorController {
  export const pageNotFound: RequestHandler = (req: RequestData, res, next) => {
    res.status(404).render("errors/404", {
      pageTitle: "Page not found",
      path: "",
    });
  };

  export const itemNotFound: RequestHandler = (req: RequestData, res, next) => {
    res.status(400).render("errors/400", {
      pageTitle: "Bad Request",
      path: "",
    });
  };
}

export default ErrorController;
