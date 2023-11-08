// Core imports from external libraries
import path from "path";
//import fs from "fs";
//import https from "https";
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
import helmet from "helmet";
// flash messages for MPAs
import flash from "connect-flash";
// compression manager
import compression from "compression";
// logger for production
import winston from "winston";
import { logger } from "./util/winston";

import User from "./models/user";
import { RequestData } from "./util/types";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.1h7avzh.mongodb.net/${process.env.MONGODB_DATABASE}?retryWrites=true&w=majority`;

const { doubleCsrfProtection } = doubleCsrf({
  getSecret: () => process.env.CSRF_TOKEN!,
  cookieName: "csrfToken",
  cookieOptions: { sameSite: "lax", secure: false, signed: true },
  size: 64,
  ignoredMethods: ["GET", "HEAD", "OPTIONS"],
  getTokenFromRequest: (req) => {
    return req.headers["x-csrf-token"]
      ? req.headers["x-csrf-token"]
      : req.body.csrfToken;
  },
});

//const privateKey = fs.readFileSync("server.key");
//const certificate = fs.readFileSync("server.cert");

const fileStorage = multer.diskStorage({
  /* destination: (req, file, cb) => {
    cb(null, path.join(mainPath as string, "images").toString());
  }, */
  destination: (req, file, cb) => {
    cb(null, `src/data/images`);
  },
  filename: (erq, file, cb) => {
    cb(null, `${Date.now()} - ${file.originalname}`);
  },
});
const fileFilter = (req, file, cb) => {
  switch (file.mimetype) {
    case "image/png":
    case "image/jpg":
    case "image/jpeg":
    case "image/tiff":
    case "image/bmp":
      cb(null, true);
      break;
    default:
      cb(null, false);
      break;
  }
  /* cb(null,true)
  cb(null,false) */
};

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

const app = express();

app.set("view engine", "ejs"); // here we tell to express that we want to compile dinamic templates with ejs engine

app.set("views", `./src/views`); // necessary because we put our views in a path different from ./views

app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ storage: fileStorage, fileFilter }).single("image"));
app.use(express.static(path.join(mainPath as string, "..", "public")));
app.use(
  `/data/images`,
  express.static(path.join(mainPath as string, "data", "images"))
);
app.use(
  session({
    secret: process.env.SESSION_TOKEN!, // to save the password for hashing
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
app.use(cookieParser(process.env.CSRF_TOKEN));
app.use(doubleCsrfProtection);
// middleware for managinf flash messages in MPAs
app.use(flash());
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        "default-src": ["'self'", "https://js.stripe.com/"],
        "script-src": ["'self'", "https://js.stripe.com/", "'unsafe-inline'"],
        "script-src-attr": ["'unsafe-inline'", "https://js.stripe.com/"],
      },
    },
  })
);
app.use(compression());

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
  console.log(error);
  res.redirect("/500");
});

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    // manual ssl encription
    /* https
      .createServer({ key: privateKey, cert: certificate }, app)
      .listen(process.env.PORT || 10000); */
    app.listen(process.env.PORT || 10000);
  })
  .catch(console.dir);
