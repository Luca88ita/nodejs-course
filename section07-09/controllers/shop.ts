import { Product } from "../models/product";

import { RequestHandler } from "express";
import { Cart } from "../models/cart";
import { CartProduct, CartType } from "../util/types";

namespace ShopController {
  export const getProducts: RequestHandler = (req, res, next) => {
    Product.fetchAll((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
      });
    });
  };

  export const getProduct: RequestHandler = (req, res, next) => {
    const productId: string = req.params.productId;
    Product.findById(productId, (product) => {
      res.render("shop/product-detail", {
        product,
        pageTitle: `${product.title} - details`,
        path: `/products/:${productId}`,
      });
    });
  };

  export const getIndex: RequestHandler = (req, res, next) => {
    Product.fetchAll((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
      });
    });
  };

  export const getCart: RequestHandler = (req, res, next) => {
    Cart.getCart((cart: CartType) => {
      Product.fetchAll((products) => {
        const cartProducts: CartProduct[] = [];
        products.forEach((product) => {
          const cartProductData = cart.products.find(
            (prod) => prod.id === product.id
          );
          cartProductData &&
            cartProducts.push({
              id: product.id,
              price: product.price,
              qty: cartProductData.qty,
              title: product.title,
              description: product.description!,
              imageUrl: product.imageUrl!,
            });
        });
        res.render("shop/cart", {
          pageTitle: "Your Cart",
          path: "/cart",
          products: cartProducts,
          totalPrice: cart.totalPrice.toFixed(2),
        });
      });
    });
  };

  export const postCart: RequestHandler = (req, res, next) => {
    const productId = req.body.productId;
    Product.findById(productId, (product) => {
      Cart.addProduct(productId, +product.price);
    });
    res.redirect("/cart");
  };

  export const postCartDeleteItem: RequestHandler = (req, res, next) => {
    const productId: string = req.body.productId;
    Product.findById(productId, (product) => {
      Cart.deleteProduct(productId, +product.price);
      res.redirect("/cart");
    });
  };

  export const getOrders: RequestHandler = (req, res, next) => {
    Product.fetchAll((products) => {
      res.render("shop/orders", {
        pageTitle: "Your Cart",
        path: "/orders",
      });
    });
  };

  export const getCheckout: RequestHandler = (req, res, next) => {
    Product.fetchAll((products) => {
      res.render("shop/checkout", {
        pageTitle: "Checkout",
        path: "/checkout",
      });
    });
  };
}

export default ShopController;
