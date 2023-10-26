import express from "express";
import bodyParser from "body-parser";

const app = express();

app.use(bodyParser.json());

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

//app.use("/feed", feedRoutes);

app.listen(8080);
