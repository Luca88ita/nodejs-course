import { NextFunction, Request, Response } from "express";
import User from "../models/user";
import { ObjectId } from "mongodb";
import Product from "../models/product";

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
  user?: User | null;
}

export interface CartItem {
  _productId: ObjectId | undefined;
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
  _userId: ObjectId | undefined;
  _id: ObjectId | undefined;
}

export interface Order {
  items: OrderItem[] | [];
  user: {
    _id: ObjectId | undefined;
    username: string;
    email: string;
  };
}
