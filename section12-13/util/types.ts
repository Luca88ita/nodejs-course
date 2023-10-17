import { NextFunction, Request, Response } from "express";
import User from "../models/user";
import { ObjectId } from "mongodb";

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
