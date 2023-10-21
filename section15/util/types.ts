import { NextFunction, Request, Response } from "express";
import { IUser } from "../models/user";
import { ProductType } from "../models/product";
import { Types } from "mongoose";
import { Session } from "express-session";

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
export interface SessionData {
  user: IUser;
  isLoggedIn: boolean;
}

export interface RequestData extends Request {
  session: Session & Partial<SessionData>;
  user?: IUser;
}

export interface CartItem {
  _productId: Types.ObjectId | ProductType | undefined;
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
