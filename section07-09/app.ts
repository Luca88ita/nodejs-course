import express from "express";
import bodyParser from "body-parser";
import { router as adminRoutes } from "./routes/admin";
import { router as shopRoutes } from "./routes/shop";
import { router as errorRoutes } from "./routes/error";
import path from "path";
import { mainPath } from "./util/path";

const app = express();

app.set("view engine", "ejs"); // here we tell to express that we want to compile dinamic templates with ejs engine

app.set("views", "./section07-09/views"); // necessary because we put our views in a path different from ./views

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(mainPath as string, "public")));

app.use("/admin", adminRoutes);

app.use(shopRoutes);

app.use(errorRoutes);

app.listen(3000);
