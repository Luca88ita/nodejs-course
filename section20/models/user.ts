import { Model, Schema, Types, model } from "mongoose";
import { Cart, CartItem } from "../util/types";
import { ProductType } from "./product";

export interface IUser {
  password: string;
  email: string;
  resetToken?: string;
  resetTokenExpiration?: number;
  cart: Cart;
  _id: Types.ObjectId;
}

interface IUserMethods {
  addToCart(product: ProductType): void;
  removeFromCart(productId: string): any;
  clearCart(): any;
}

export type UserModel = Model<IUser, {}, IUserMethods>;

const userSchema = new Schema<IUser, UserModel, IUserMethods>({
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  resetToken: String,
  resetTokenExpiration: Date,
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

userSchema.method("removeFromCart", function removeFromCart(productId: string) {
  const updatedCartItems = this.cart.items.filter((item: CartItem) => {
    return item._productId!._id.toString() !== productId;
  });
  this.cart.items = updatedCartItems;
  return this.save();
});

userSchema.method("clearCart", function clearCart() {
  this.cart.items = [];
  return this.save();
});

const User = model<IUser, UserModel>("User", userSchema);

export default User;
