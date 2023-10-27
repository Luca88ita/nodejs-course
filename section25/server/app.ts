import path from "path";
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import feedRoutes from "./routes/feed";
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

app.use("/feed", feedRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message });
});

mongoose
  .connect(mongoDbUri)
  .then((result) => app.listen(8080))
  .catch((err) => console.log(err));
