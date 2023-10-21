import { RequestHandler } from "express";
import { RequestData } from "../util/types";

namespace MessagesController {
  export const editSuccess: RequestHandler = (req: RequestData, res, next) => {
    res.status(200).render("messages/edit-success", {
      pageTitle: "Success",
      path: "",
      isAuthenticated: req.session.isLoggedIn,
    });
  };

  export const deleteSuccess: RequestHandler = (
    req: RequestData,
    res,
    next
  ) => {
    res.status(200).render("messages/delete-success", {
      pageTitle: "Success",
      path: "",
      isAuthenticated: req.session.isLoggedIn,
    });
  };
}

export default MessagesController;
