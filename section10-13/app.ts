// Core imports from external libraries
import path from "path";
import express from "express";
import bodyParser from "body-parser";
// Routes
import adminRoutes from "./routes/admin";
import shopRoutes from "./routes/shop";
import errorRoutes from "./routes/error";
import messageRoutes from "./routes/messages";
// Paths
import mainPath from "./util/path";
// DB
import sequelize from "./util/database";
import User from "./models/user";
import Product from "./models/product";
import { UserRequest } from "./util/types";
import Cart from "./models/cart";
import CartItem from "./models/cart-item";

const app = express();

app.set("view engine", "ejs"); // here we tell to express that we want to compile dinamic templates with ejs engine

app.set("views", "./section10-13/views"); // necessary because we put our views in a path different from ./views

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(mainPath as string, "public")));

app.use((req: UserRequest, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user && user;
      next();
    })
    .catch((err) => console.log(err));
});

// used routes
app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(messageRoutes);
app.use(errorRoutes);

// sequelize associations
User.hasMany(Product);
Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

sequelize
  .sync(/* { force: true } */)
  .then((res) => {
    //console.log(sequelize.models);
    //console.log(res);
    return User.findByPk(1);
  })
  .then((user) => {
    return user
      ? Promise.resolve(user)
      : User.create({ username: "Luca", email: "luca1234@567.890" });
  })
  .then((user) =>
    user.getCart().then((cart) => {
      !cart && user.createCart();
    })
  )
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));
