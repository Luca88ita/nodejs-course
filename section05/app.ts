import express from "express";
import bodyParser from "body-parser";
import { router as adminRoutes } from "./routes/admin";
import { router as shopRoutes } from "./routes/shop";
import { router as errorRoutes } from "./routes/error";
import path from "path";
import { mainPath } from "./util/path";

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(mainPath as string, "public")));

app.use("/admin", adminRoutes);

app.use(shopRoutes);

app.use(errorRoutes);

app.listen(3000);
