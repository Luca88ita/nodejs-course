import { Model, Schema, Types, model } from "mongoose";
import { OrderItem, Order } from "../util/types";

export interface IOrder {
  products: OrderItem[];
  user: any;
  _id: Types.ObjectId;
}

interface IOrderMethods {}

type OrderModel = Model<IOrder, {}, IOrderMethods>;

const orderSchema = new Schema<IOrder, OrderModel, IOrderMethods>({
  products: [
    {
      product: { type: Object, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  user: {
    _userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    email: { type: String, required: true },
  },
});

const Order = model<IOrder, OrderModel>("Order", orderSchema);

export default Order;
