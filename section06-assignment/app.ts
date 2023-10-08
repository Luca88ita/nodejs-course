import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { mainPath } from "./util/path";
import { router as homeRouter } from "./routes/home";
import { router as usersRouter } from "./routes/users";

const app = express();

app.set("view engine", "ejs");
app.set("views", "./section06-assignment/views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(mainPath as string, "public")));

app.use(usersRouter);

app.use(homeRouter);

app.listen(3000);
