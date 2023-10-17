import { RequestHandler } from "express";
import { UserRequest } from "../util/types";

namespace ShopController {
  export const getProducts: RequestHandler = (req, res, next) => {
    /* Product.fetchAll()
      .then((products) => {
        if (!products || products.length <= 0)
          return res.redirect("/errors/400");
        res.render("shop/product-list", {
          products,
          pageTitle: "All Products",
          path: "/products",
        });
      })
      .catch((err) => console.log(err)); */
  };

  export const getProduct: RequestHandler = (req, res, next) => {
    const productId: string = req.params.productId;
    /* Product.findById(productId)
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
      }); */
  };

  export const getIndex: RequestHandler = (req, res, next) => {
    /* Product.fetchAll()
      .then((products) => {
        if (!products || products.length <= 0)
          return res.redirect("/errors/400");
        res.render("shop/index", {
          products,
          pageTitle: "Shop",
          path: "/",
        });
      })
      .catch((err) => console.log(err)); */
  };

  export const getCart: RequestHandler = (req: UserRequest, res, next) => {
    /* req
      .user!.getCart()
      .then((products) => {
        let totalPrice = 0;
        if (products)
          products.forEach((product) => {
            totalPrice = totalPrice + product.price * product.quantity!;
          });
        res.render("shop/cart", {
          pageTitle: "Your Cart",
          path: "/cart",
          products,
          totalPrice: totalPrice.toFixed(2),
        });
      })
      .catch((err) => {
        console.log(err);
      }); */
  };

  export const postCart: RequestHandler = (req: UserRequest, res, next) => {
    const productId = req.body.productId;
    /* Product.findById(productId)
      .then((product) => {
        return req.user!.addToCart(product as Product);
      })
      .then(() => res.redirect("/cart"))
      .catch((err) => console.log(err)); */
  };

  export const postCartDeleteItem: RequestHandler = (
    req: UserRequest,
    res,
    next
  ) => {
    const productId: string = req.body.productId;
    /* req
      .user!.removeFromCart(productId)
      .then((result) => res.redirect("/cart"))
      .catch((err) => console.log(err)); */
  };

  export const getOrders: RequestHandler = (req: UserRequest, res, next) => {
    /* req
      .user!.getOrders()
      .then((orders) => {
        res.render("shop/orders", {
          pageTitle: "Your Cart",
          path: "/orders",
          orders,
        });
      })
      .catch((err) => {
        console.log(err);
      }); */
  };

  export const postOrder: RequestHandler = (req: UserRequest, res, next) => {
    /* req
      .user!.addOrder()
      .then((result) => {
        res.redirect("/orders");
      })
      .catch((err) => console.log(err)); */
  };

  export const getCheckout: RequestHandler = (req, res, next) => {
    /* res.render("shop/checkout", {
      pageTitle: "Checkout",
      path: "/checkout",
    }); */
  };
}

export default ShopController;
