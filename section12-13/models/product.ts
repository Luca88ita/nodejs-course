import { client, getDb } from "../util/database";

class Product {
  title: string;
  price: number;
  description: string;
  imageUrl: string;

  constructor(
    title: string,
    price: number,
    description: string,
    imageUrl: string
  ) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
  }

  /* save() {
    const db = getDb();
    return db
      .collection("products")
      .insertOne(this)
      .then((result) => console.log(result))
      .catch((err) => console.log(err));
  } */
  async save() {
    const db = client.db();
    try {
      const result = await db.collection("products").insertOne(this);
      return console.log(result);
    } catch (err) {
      return console.log(err);
    }
  }
}

export default Product;
