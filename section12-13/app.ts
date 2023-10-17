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
import mongoConnect, { client } from "./util/database";

import User from "./models/user";
import { UserRequest } from "./util/types";

const app = express();
const userId = "652efa81698c348fb6ae91fb";

app.set("view engine", "ejs"); // here we tell to express that we want to compile dinamic templates with ejs engine

app.set("views", "./section12-13/views"); // necessary because we put our views in a path different from ./views

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(mainPath as string, "public")));

app.use((req: UserRequest, res, next) => {
  User.findById(userId)
    .then((user) => {
      if (user)
        req.user = new User(user.username, user.email, user.cart, userId);
      next();
    })
    .catch((err) => console.log(err));
});

// used routes
app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(messageRoutes);
app.use(errorRoutes);

mongoConnect()
  .then(() => {
    //console.log(client);
    return User.findById(userId);
  })
  .then((result) => {
    if (!result) {
      const user = new User("luca1988", "prova@prova.com", { items: [] });
      user.save();
    }
  })
  .then(() => {
    app.listen(3000);
  })
  .catch(console.dir);
