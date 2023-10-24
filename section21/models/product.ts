import { Schema, Types, model } from "mongoose";

export interface ProductType {
  title: string;
  price: number;
  description: string;
  imageUrl: string;
  _id: Types.ObjectId;
  _userId: Types.ObjectId;
}

const productSchema = new Schema<ProductType>({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  _userId: { type: Schema.Types.ObjectId, ref: "User" },
});

const Product = model<ProductType>("Product", productSchema);

export default Product;
