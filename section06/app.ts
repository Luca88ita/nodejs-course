import express from "express";
import bodyParser from "body-parser";
import { engine } from "express-handlebars";
import { router as adminRoutes } from "./routes/admin";
import { router as shopRoutes } from "./routes/shop";
import { router as errorRoutes } from "./routes/error";
import path from "path";
import { mainPath } from "./util/path";

const app = express();

app.set("view engine", "ejs");

/*app.engine(
  "hbs",
  engine({
    extname: "hbs",
    defaultLayout: "main-layout",
    layoutsDir: "section06/views/layouts/",
  })
);

app.set("view engine", "hbs");*/

//app.set("view engine", "pug"); // here we tell to express that we want to compile dinamic templates with pug engine
app.set("views", "./section06/views"); // necessary now - in case we put our views in a folder different from views

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(mainPath as string, "public")));

app.use("/admin", adminRoutes);

app.use(shopRoutes);

app.use(errorRoutes);

app.listen(3000);
