import { RequestHandler } from "express";
import { RequestData } from "../util/types";

namespace ErrorController {
  export const pageNotFound: RequestHandler = (req: RequestData, res, next) => {
    res.status(404).render("errors/404", {
      pageTitle: "Page not found",
      path: "/404",
    });
  };

  export const itemNotFound: RequestHandler = (req: RequestData, res, next) => {
    res.status(400).render("errors/400", {
      pageTitle: "Bad Request",
      path: "/400",
    });
  };

  export const get500: RequestHandler = (req: RequestData, res, next) => {
    res.status(500).render("errors/500", {
      pageTitle: "Error!",
      path: "/500",
    });
  };
}

export default ErrorController;
