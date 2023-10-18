import { Model, Schema, Types, model } from "mongoose";
import { Cart, CartItem, CartProduct } from "../util/types";
import { ProductType } from "./product";

export interface IUser {
  username: string;
  email: string;
  cart: Cart;
  _id: Types.ObjectId;
}

interface IUserMethods {
  addToCart(): void;
}

type UserModel = Model<IUser, {}, IUserMethods>;

const userSchema = new Schema<IUser, UserModel, IUserMethods>({
  username: { type: String, required: true },
  email: { type: String, required: true },
  cart: {
    items: [
      {
        _productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
});

userSchema.method("addToCart", function addToCart(product: ProductType) {
  const cartProductIndex = this.cart.items.findIndex((ci: CartItem) => {
    return ci._productId?.toString() === product._id?.toString();
  });
  const updatedCartItems = [...this.cart.items];

  const quantity =
    cartProductIndex >= 0 ? updatedCartItems[cartProductIndex].quantity + 1 : 1;

  cartProductIndex >= 0
    ? (updatedCartItems[cartProductIndex].quantity = quantity)
    : updatedCartItems.push({ _productId: product._id, quantity: quantity });

  const updatedCart = { items: updatedCartItems };
  this.cart = updatedCart;
  return this.save();
});

const User = model<IUser, UserModel>("User", userSchema);

export default User;
/* 
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
  // USER METHODS
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
  // CART METHODS
  async getCart() {
    const productIds = this.cart.items.map((item) => {
      return item._productId;
    });
    return db
      .collection<User>("products")
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

  async addToCart(product: User) {
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

  async removeFromCart(productId: string) {
    const updatedCartItems = this.cart.items.filter((item) => {
      return item._productId?.toString() !== productId.toString();
    });

    return db
      .collection("users")
      .updateOne(
        { _id: this._id },
        { $set: { cart: { items: updatedCartItems } } }
      );
  }
  // ORDER METHODS
  async addOrder() {
    const products = await this.getCart();
    const order: Order = {
      items: products,
      user: {
        _id: this._id,
        username: this.username,
        email: this.email,
      },
    };
    await db.collection<Order>("orders").insertOne(order);
    this.cart = { items: [] };
    db.collection("users").updateOne(
      { _id: this._id },
      { $set: { cart: { items: [] } } }
    );
  }

  getOrders() {
    return db
      .collection<Order>("orders")
      .find({ "user._id": this._id })
      .toArray();
  }
}

export default User;
 */
