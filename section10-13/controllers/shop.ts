import { RequestHandler } from "express";
import { Cart } from "../models/cart";
import Product from "../models/product";
import { UserRequest } from "../util/types";

namespace ShopController {
  export const getProducts: RequestHandler = (req, res, next) => {
    Product.findAll()
      .then((products) => {
        res.render("shop/product-list", {
          products,
          pageTitle: "All Products",
          path: "/products",
        });
      })
      .catch((err) => console.log(err));
  };

  export const getProduct: RequestHandler = (req, res, next) => {
    const productId: string = req.params.productId;
    Product.findByPk(productId)
      .then((product) => {
        if (!product) return res.redirect("/errors/400");
        res.render("shop/product-detail", {
          product,
          pageTitle: `${product.title} - details`,
          path: `/products/:${productId}`,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  export const getIndex: RequestHandler = (req, res, next) => {
    Product.findAll()
      .then((products) => {
        res.render("shop/index", {
          products,
          pageTitle: "Shop",
          path: "/",
        });
      })
      .catch((err) => console.log(err));
  };

  export const getCart: RequestHandler = (req: UserRequest, res, next) => {
    req
      .user!.getCart()
      .then((cart): void | Promise<any> => {
        if (!cart) return res.redirect("/errors/400");
        return cart.getProducts();
      })
      .then((products) => {
        res.render("shop/cart", {
          pageTitle: "Your Cart",
          path: "/cart",
          products,
          totalPrice: 10, //cart.totalPrice.toFixed(2),
        });
      })
      .catch((err) => {
        console.log(err);
      });
    /*Cart.getCart((cart: CartType) => {
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
    });*/
  };

  export const postCart: RequestHandler = (req, res, next) => {
    const productId = req.body.productId;
    /*Product.findById(productId, (product) => {
      Cart.addProduct(productId, +product.price);
    });
    res.redirect("/cart");*/
  };

  export const postCartDeleteItem: RequestHandler = (req, res, next) => {
    const productId: string = req.body.productId;
    /*Product.findById(productId, (product) => {
      Cart.deleteProduct(productId, +product.price);
      res.redirect("/cart");
    });*/
  };

  export const getOrders: RequestHandler = (req, res, next) => {
    /*Product.fetchAll((products) => {
      res.render("shop/orders", {
        pageTitle: "Your Cart",
        path: "/orders",
      });
    });*/
  };

  export const getCheckout: RequestHandler = (req, res, next) => {
    /*Product.fetchAll((products) => {
      res.render("shop/checkout", {
        pageTitle: "Checkout",
        path: "/checkout",
      });
    });*/
  };
}

export default ShopController;
