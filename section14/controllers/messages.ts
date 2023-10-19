import { RequestHandler } from "express";
import { UserRequest } from "../util/types";

namespace MessagesController {
  export const editSuccess: RequestHandler = (req: UserRequest, res, next) => {
    res
      .status(200)
      .render("messages/edit-success", {
        pageTitle: "Success",
        path: "",
        isAuthenticated: req.isLoggedIn,
      });
  };

  export const deleteSuccess: RequestHandler = (
    req: UserRequest,
    res,
    next
  ) => {
    res
      .status(200)
      .render("messages/delete-success", {
        pageTitle: "Success",
        path: "",
        isAuthenticated: req.isLoggedIn,
      });
  };
}

export default MessagesController;
