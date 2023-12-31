// Core imports from external libraries
import path from "path";
import express from "express";
import bodyParser from "body-parser";
// Routes
import adminRoutes from "./routes/admin";
import shopRoutes from "./routes/shop";
import authRoutes from "./routes/auth";
import errorRoutes from "./routes/error";
import messageRoutes from "./routes/messages";
// Paths
import mainPath from "./util/path";
// DB
import mongoose from "mongoose";
// session manager
import session from "express-session";
import MongoStore from "connect-mongo";

import User from "./models/user";
import { RequestData } from "./util/types";

const app = express();
export const userId = "653270fbeb02c722f6b8fafe";
const MONGODB_URI =
  "mongodb+srv://nodejs:chmIiGq8tLlXsnHd@cluster0.1h7avzh.mongodb.net/shop?retryWrites=true&w=majority";

app.set("view engine", "ejs"); // here we tell to express that we want to compile dinamic templates with ejs engine

app.set("views", "./section14/views"); // necessary because we put our views in a path different from ./views

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(mainPath as string, "public")));
app.use(
  session({
    secret: "my secret", // to save the password for hashing
    resave: false, // the session will be saved only if there will be chnages
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: MONGODB_URI,
      //dbName: "shop-session",
      collectionName: "sessions",
      ttl: 7 * 24 * 60 * 60,
      //stringify: false,
      touchAfter: 24 * 3600,
      /*crypto: {
        secret: "my secret",
      },*/
    }),
    //cookie: { maxAge: 3600 },
  })
);

// middleware for adding the user instance to every request
app.use((req: RequestData, res, next) => {
  if (!req.session.user) return next();
  User.findById(req.session.user!._id)
    .then((user) => {
      if (user) req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});

// used routes
app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(messageRoutes);
app.use(authRoutes);
app.use(errorRoutes);

mongoose
  .connect(MONGODB_URI)
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
