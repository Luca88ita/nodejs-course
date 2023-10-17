import { RequestHandler } from "express";

namespace MessagesController {
  export const editSuccess: RequestHandler = (req, res, next) => {
    res
      .status(200)
      .render("messages/edit-success", { pageTitle: "Success", path: "" });
  };

  export const deleteSuccess: RequestHandler = (req, res, next) => {
    res
      .status(200)
      .render("messages/delete-success", { pageTitle: "Success", path: "" });
  };
}

export default MessagesController;
