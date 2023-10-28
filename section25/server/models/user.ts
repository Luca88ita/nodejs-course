import { Model, Schema, Types, model } from "mongoose";
import { IPost } from "./post";

export interface IUser {
  email: string;
  password: string;
  name: string;
  status: string;
  posts: IPost[];
  resetToken?: string;
  resetTokenExpiration?: number;
  _id: Types.ObjectId;
}

interface IUserMethods {}

export type UserModel = Model<IUser, {}, IUserMethods>;

const userSchema = new Schema<IUser, UserModel, IUserMethods>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  status: { type: String, required: true },
  resetToken: String,
  resetTokenExpiration: Date,
  posts: [{ type: Schema.Types.ObjectId, ref: "Post", required: true }],
});

/* userSchema.method("addToCart", function addToCart(product: ProductType) {
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
}); */

const User = model<IUser, UserModel>("User", userSchema);

export default User;
