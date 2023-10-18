import { NextFunction, Request, Response } from "express";
import { IUser } from "../models/user";
import Product from "../models/product";
import { Types } from "mongoose";

export type CartProduct = {
  id: string;
  price: number;
  qty: number;
  title?: string;
  description?: string;
  imageUrl?: string;
};

export type CartType = {
  products: CartProduct[];
  totalPrice: number;
};

export interface UserRequest extends Request {
  user?: IUser | null;
}

export interface CartItem {
  _productId: Types.ObjectId | undefined;
  quantity: number;
}

export interface Cart {
  items: CartItem[] | [];
}

export interface OrderItem {
  quantity: number | undefined;
  title: string;
  price: number;
  description: string;
  imageUrl: string;
  _userId: Types.ObjectId | undefined;
  _id: Types.ObjectId | undefined;
}

export interface Order {
  items: OrderItem[] | [];
  user: {
    _id: Types.ObjectId | undefined;
    username: string;
    email: string;
  };
}
