import { ObjectId } from "mongodb";
import { client } from "../util/database";

const db = client.db();

class Product {
  title: string;
  price: number;
  description: string;
  imageUrl: string;
  _id: ObjectId | undefined;

  constructor(
    title: string,
    price: number,
    description: string,
    imageUrl: string,
    id?: string | undefined
  ) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = id ? new ObjectId(id) : undefined;
  }

  async save() {
    const dbOperation = this._id
      ? db.collection("products").updateOne({ _id: this._id }, { $set: this })
      : db.collection("products").insertOne(this);
    return dbOperation
      .then((result) => console.log(result))
      .catch((err) => console.log(err));
  }

  static async deleteById(prodId: string) {
    try {
      const result = await db
        .collection("products")
        .deleteOne({ _id: new ObjectId(prodId) });
      return console.log(result);
    } catch (err) {
      return console.log(err);
    }
  }

  static async fetchAll() {
    try {
      const products = await db.collection("products").find().toArray();
      console.log(products);
      return products;
    } catch (err) {
      return console.log(err);
    }
  }

  static async findById(prodId: string) {
    try {
      const product = await db
        .collection("products")
        .findOne({ _id: new ObjectId(prodId) });
      console.log(product);
      return product;
    } catch (err) {
      return console.log(err);
    }
  }
}

export default Product;
