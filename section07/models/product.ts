import fs from "fs";
import path from "path";
import { mainPath } from "../util/path";

const p = path.join(mainPath as string, "data", "products.json");

const getProductsFromFile = (cb: (products: Product[]) => void) => {
  fs.readFile(p, (err, fileContent) => {
    cb(err ? [] : JSON.parse(fileContent.toString()));
  });
};

export class Product {
  title: string;

  constructor(title: string) {
    this.title = title;
  }

  save() {
    getProductsFromFile((products) => {
      products.push(this);
      fs.writeFile(p, JSON.stringify(products), (err) => {
        err && console.log(err);
      });
    });
  }

  static fetchAll(cb: (products: Product[]) => void) {
    getProductsFromFile(cb);
  }
}
