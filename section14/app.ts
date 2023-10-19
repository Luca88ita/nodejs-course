// Core imports from external libraries
import path from "path";
import express from "express";
import bodyParser from "body-parser";
// Routes
import adminRoutes from "./routes/admin";
import shopRoutes from "./routes/shop";
import errorRoutes from "./routes/error";
import messageRoutes from "./routes/messages";
// Paths
import mainPath from "./util/path";
// DB
import mongoose from "mongoose";

import { UserRequest } from "./util/types";
import User from "./models/user";

const app = express();
const userId = "652fd6ba0dd5af92c46c8866";

app.set("view engine", "ejs"); // here we tell to express that we want to compile dinamic templates with ejs engine

app.set("views", "./section14/views"); // necessary because we put our views in a path different from ./views

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(mainPath as string, "public")));

app.use((req: UserRequest, res, next) => {
  User.findById(userId)
    .then((user) => {
      if (user) req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

// used routes
app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(messageRoutes);
app.use(errorRoutes);

mongoose
  .connect(
    "mongodb+srv://nodejs:chmIiGq8tLlXsnHd@cluster0.1h7avzh.mongodb.net/shop?retryWrites=true&w=majority"
  )
  .then(() => {
    return User.findById(userId);
  })
  .then((result) => {
    if (!result) {
      const user = new User({
        username: "luca1988",
        email: "prova@prova.com",
        cart: { items: [] },
      });
      user.save();
    }
  })
  .then(() => {
    app.listen(3000);
  })
  .catch(console.dir);
