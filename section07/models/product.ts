import fs from "fs";
import path from "path";
import { mainPath } from "../util/path";
import { Cart } from "./cart";

const p = path.join(mainPath as string, "data", "products.json");

const getProductsFromFile = (cb: (products: Product[]) => void) => {
  fs.readFile(p, (err, fileContent) => {
    cb(err ? [] : JSON.parse(fileContent.toString()));
  });
};

export class Product {
  id: string;
  title: string;
  imageUrl: string | null;
  description: string | null;
  price: number;

  constructor(
    title: string,
    imageUrl: string | null,
    description: string | null,
    price: number,
    id?: string
  ) {
    this.id = id ? id : Math.random().toString();
    this.title = title;
    this.imageUrl = imageUrl
      ? imageUrl
      : "https://cdn.pixabay.com/photo/2016/03/31/20/51/book-1296045_960_720.png";
    this.description = description ? description : "No description available";
    this.price = price;
  }

  save() {
    getProductsFromFile((products) => {
      const existingProductIndex = products.findIndex(
        (product) => product.id === this.id
      );
      if (existingProductIndex >= 0) {
        const updatedProducts = [...products];
        updatedProducts[existingProductIndex] = this;
        fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
          err && console.log(err);
        });
      } else {
        products.push(this);
        fs.writeFile(p, JSON.stringify(products), (err) => {
          err && console.log(err);
        });
      }
    });
  }

  static fetchAll(cb: (products: Product[]) => void) {
    getProductsFromFile(cb);
  }

  static findById(id: string, cb: (products: Product) => void) {
    getProductsFromFile((products) => {
      const product = products.find((p) => p.id === id);
      product && cb(product);
    });
  }

  static deleteById(id: string) {
    getProductsFromFile((products) => {
      const product = products.find((prod) => prod.id === id);
      const updatedProducts = products.filter((product) => product.id !== id);
      fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
        if (!err) {
          Cart.deleteProduct(id, product!.price);
        }
      });
    });
  }
}
