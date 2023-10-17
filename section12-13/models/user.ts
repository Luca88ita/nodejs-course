import { ObjectId } from "mongodb";
import { client } from "../util/database";
import Product from "./product";
import { Cart } from "../util/types";
import { products } from "../../section06/routes/admin";

const db = client.db();

class User {
  username: string;
  email: string;
  cart: Cart;
  _id: ObjectId | undefined;

  constructor(
    username: string,
    email: string,
    cart: Cart,
    id?: string | undefined
  ) {
    this.username = username;
    this.email = email;
    this.cart = cart;
    this._id = id ? new ObjectId(id) : undefined;
  }

  async save() {
    const dbOperation = this._id
      ? db
          .collection<User>("users")
          .updateOne({ _id: this._id }, { $set: this })
      : db.collection<User>("users").insertOne(this);
    return dbOperation
      .then((result) => console.log(result))
      .catch((err) => console.log(err));
  }

  static async deleteById(userId: string) {
    try {
      const result = await db
        .collection<User>("users")
        .deleteOne({ _id: new ObjectId(userId) });
      return console.log(result);
    } catch (err) {
      return console.log(err);
    }
  }

  static async fetchAll() {
    try {
      const users = await db.collection<User>("users").find().toArray();
      //console.log(users);
      return users;
    } catch (err) {
      return console.log(err);
    }
  }

  static async findById(userId: string) {
    try {
      const user = await db
        .collection<User>("users")
        .findOne({ _id: new ObjectId(userId) });
      //console.log(user);
      return user;
    } catch (err) {
      return console.log(err);
    }
  }

  async getCart() {
    const productIds = this.cart.items.map((item) => {
      return item._productId;
    });
    return db
      .collection<Product>("products")
      .find({ _id: { $in: productIds } })
      .toArray()
      .then((products) => {
        return products.map((product) => {
          return {
            ...product,
            quantity: this.cart.items.find((item) => {
              return item._productId?.toString() === product._id?.toString();
            })?.quantity,
          };
        });
      });
  }

  async addToCart(product: Product) {
    const cartProductIndex = this.cart.items.findIndex((cp) => {
      return cp._productId?.toString() === product._id?.toString();
    });
    const updatedCartItems = [...this.cart.items];

    const quantity =
      cartProductIndex >= 0
        ? updatedCartItems[cartProductIndex].quantity + 1
        : 1;

    cartProductIndex >= 0
      ? (updatedCartItems[cartProductIndex].quantity = quantity)
      : updatedCartItems.push({ _productId: product._id, quantity: quantity });

    const updatedCart = { items: updatedCartItems };
    return db
      .collection("users")
      .updateOne({ _id: this._id }, { $set: { cart: updatedCart } });
  }
}

export default User;
