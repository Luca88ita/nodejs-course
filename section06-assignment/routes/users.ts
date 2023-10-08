import express from "express";
import { userList } from "./home";

export const router = express.Router();

router.use("/users", (req, res, next) => {
  res.render("users", {
    userList,
    pageTitle: "Users",
    path: "/users",
    activeUsers: true,
  });
});
