import path from "path";
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import feedRoutes from "./routes/feed";
import userRoutes from "./routes/user";
import { multerImageMilldeware } from "./utils/multer";

dotenv.config();
const mongoDbUri = process.env.MONGODB_URI;

const app = express();

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

app.use("/auth", authRoutes);
app.use("/feed", feedRoutes);
app.use("/user", userRoutes);

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
    const server = app.listen(8080);
    const io = new Server(server);
    io.on("connection", (socket) => {
      console.log("Client connected");
    });
  })
  .catch((err) => console.log(err));
