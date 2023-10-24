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
// Session manager
import session from "express-session";
import MongoStore from "connect-mongo";
// Security
import { doubleCsrf } from "csrf-csrf";
import cookieParser from "cookie-parser";
// flash messages for MPAs
import flash from "connect-flash";

import User from "./models/user";
import { RequestData } from "./util/types";

const { doubleCsrfProtection } = doubleCsrf({
  getSecret: () => "my secret",
  cookieName: "csrfToken",
  cookieOptions: { sameSite: "lax", secure: false, signed: true },
  size: 64,
  ignoredMethods: ["GET", "HEAD", "OPTIONS"],
  getTokenFromRequest: (req) => req.body.csrfToken,
});

const app = express();
export const userId = "6532fa6cffbc4d98938721d3";
const MONGODB_URI =
  "mongodb+srv://nodejs:chmIiGq8tLlXsnHd@cluster0.1h7avzh.mongodb.net/shop?retryWrites=true&w=majority";

app.set("view engine", "ejs"); // here we tell to express that we want to compile dinamic templates with ejs engine

app.set("views", "./section15-19/views"); // necessary because we put our views in a path different from ./views

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

// middlewares for managing the CSRF protection
app.use(cookieParser("my secret"));
app.use(doubleCsrfProtection);
// middleware for managinf flash messages in MPAs
app.use(flash());

// middleware for adding the user instance to every request
app.use((req: RequestData, res, next) => {
  if (!req.session.user) return next();
  User.findById(req.session.user!._id)
    .then((user) => {
      if (user) req.user = user;
      next();
    })
    .catch((err) => {
      next(new Error(err));
    });
});

// middleware for adding the authentication and csrf token in every request
app.use((req: RequestData, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  //@ts-ignore
  res.locals.csrfToken = req.csrfToken();
  next();
});

// used routes
app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(messageRoutes);
app.use(authRoutes);
app.use(errorRoutes);

app.use((error, req, res, next) => {
  res.redirect("/500");
});

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    app.listen(3000);
  })
  .catch(console.dir);
