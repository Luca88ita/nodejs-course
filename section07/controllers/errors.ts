import { RequestHandler } from "express";

export const pageNotFound: RequestHandler = (req, res, next) => {
  res.status(404).render("404", { pageTitle: "Page not found", path: "" });
};
