import path from "path";
import http from "http";
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { multerImageMilldeware } from "./utils/multer";

import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import { apolloServer } from "./graphql/apolloServer";
import User from "./models/user";
import { isAuth } from "./middleware/auth";
import Utils from "./utils/utils";

dotenv.config();

const corsOptions = { origin: "*", optionsSuccessStatus: 200 };
const mongoDbUri = process.env.MONGODB_URI;
const app = express();
const httpServer = http.createServer(app);

const server = apolloServer(httpServer);

const startServer = async () => {
  await server.start();
};

app.use(bodyParser.json());
app.use(multerImageMilldeware);
app.use("/images", express.static(path.join(__dirname, "images")));

// middleware to avoid the CORS policy error
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.put("/post-image", isAuth, (req, res, next) => {
  if (!req.isAuth) return res.status(401).json({ message: "Not authorized" });
  if (!req.file) {
    return res.status(200).json({ message: "No file provided" });
  }
  if (req.body.odlPath) {
    Utils.clearImage(req.body.oldPath);
  }
  return res
    .status(201)
    .json({ message: "File stored", filePath: req.file.path });
});

startServer().then(() =>
  app.use(
    "/",
    cors<cors.CorsRequest>(corsOptions),
    express.json(),
    isAuth,
    expressMiddleware(server, {
      context: async ({ req }) => ({
        token: req.headers.token,
        dataSources: {
          userId: req.userId,
          isAuth: req.isAuth,
        },
      }),
    })
  )
);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message, data });
});

mongoose
  .connect(mongoDbUri)
  .then((result) => {
    app.listen(8080);
  })
  .catch((err) => console.log(err));
