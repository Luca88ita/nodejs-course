import express from "express";
import path from "path";
import { mainPath } from "../util/path";
import { User } from "../util/types";

export const router = express.Router();

export const userList: User[] = [];

router.get("/", (req, res, next) => {
  res.render("home", {
    pageTitle: "Home",
    path: "/",
    activeHome: true,
  });
});

router.post("/", (req, res, next) => {
  console.log(req.body);
  userList.push({
    lastName: req.body.lastName,
    firstName: req.body.firstName,
    age: req.body.age,
  });

  res.redirect("/");
});
