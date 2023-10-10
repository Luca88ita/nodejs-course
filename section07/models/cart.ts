import fs from "fs";
import path from "path";
import { mainPath } from "../util/path";
import { CartProduct, CartType } from "../util/types";

const c = path.join(mainPath as string, "data", "cart.json");

export class Cart {
  static addProduct(id: string, price: number) {
    fs.readFile(c, (err, fileContent) => {
      const cart: CartType = err
        ? { products: [], totalPrice: 0 }
        : JSON.parse(fileContent.toString());

      const existingProductIndex = cart.products.findIndex(
        (prod) => prod.id === id
      );
      const existingProduct = cart.products[existingProductIndex];
      let updatedProduct: CartProduct;
      if (existingProduct) {
        updatedProduct = { ...existingProduct };
        updatedProduct.qty = updatedProduct.qty + 1;
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = { id, price, qty: 1 };
        cart.products = [...cart.products, updatedProduct];
      }
      cart.totalPrice = parseFloat(
        cart.products
          .reduce((sum, product) => {
            return sum + product.price * product.qty;
          }, 0)
          .toFixed(2)
      );

      fs.writeFile(c, JSON.stringify(cart), (err) => {
        console.log(err);
      });
    });
  }

  static deleteProduct(id: string, price: number) {
    fs.readFile(c, (err, fileContent) => {
      if (err) {
        return;
      }
      const cart: CartType = JSON.parse(fileContent.toString());
      const updatedCart = { ...cart };
      const product = updatedCart.products.find((product) => product.id === id);
      if (!product) return;
      const productQuantity = product.qty;
      updatedCart.products = updatedCart.products.filter(
        (prod) => prod.id !== id
      );
      updatedCart.totalPrice = updatedCart.totalPrice - price * productQuantity;

      fs.writeFile(c, JSON.stringify(updatedCart), (err) => {
        console.log(err);
      });
    });
  }

  static getCart(cb: any) {
    fs.readFile(c, (err, fileContent) => {
      const cart: CartType = JSON.parse(fileContent.toString());
      cb(err ? null : cart);
    });
  }
}
