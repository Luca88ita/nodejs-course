import { RequestHandler } from "express";
import { CartItem, RequestData } from "../util/types";
import Product, { ProductType } from "../models/product";
import User from "../models/user";
import Order from "../models/order";

namespace ShopController {
  export const getProducts: RequestHandler = (req: RequestData, res, next) => {
    Product.find()
      .then((products) => {
        if (!products || products.length <= 0)
          return res.redirect("/errors/400");
        res.render("shop/product-list", {
          products,
          pageTitle: "All Products",
          path: "/products",
          isAuthenticated: req.session.isLoggedIn,
        });
      })
      .catch((err) => console.log(err));
  };

  export const getProduct: RequestHandler = (req: RequestData, res, next) => {
    const productId: string = req.params.productId;
    Product.findById(productId)
      .then((product) => {
        if (!product) return res.redirect("/errors/400");
        res.render("shop/product-detail", {
          product,
          pageTitle: `${product.title} - details`,
          path: `/products/:${productId}`,
          isAuthenticated: req.session.isLoggedIn,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  export const getIndex: RequestHandler = (req: RequestData, res, next) => {
    Product.find()
      .then((products) => {
        if (!products || products.length <= 0)
          return res.redirect("/errors/400");
        res.render("shop/index", {
          products,
          pageTitle: "Shop",
          path: "/",
          isAuthenticated: req.session.isLoggedIn,
        });
      })
      .catch((err) => console.log(err));
  };

  export const getCart: RequestHandler = (req: RequestData, res, next) => {
    const user = new User(req.user);
    user.isNew = false;
    user
      .populate("cart.items._productId")
      .then((user) => {
        const products = user.cart.items;
        let totalPrice = 0;
        if (products)
          products.forEach((product) => {
            const productDetails: ProductType =
              product._productId as ProductType;
            totalPrice = totalPrice + productDetails.price * product.quantity!;
          });
        res.render("shop/cart", {
          pageTitle: "Your Cart",
          path: "/cart",
          products,
          totalPrice: totalPrice.toFixed(2),
          isAuthenticated: req.session.isLoggedIn,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  export const postCart: RequestHandler = (req: RequestData, res, next) => {
    const productId = req.body.productId;
    const user = new User(req.user);
    user.isNew = false;
    Product.findById(productId)
      .then((product) => {
        //console.log(user);
        return user.addToCart(product as ProductType);
      })
      .then(() => res.redirect("/cart"))
      .catch((err) => console.log(err));
  };

  export const postCartDeleteItem: RequestHandler = (
    req: RequestData,
    res,
    next
  ) => {
    const productId: string = req.body.productId;
    const user = new User(req.user);
    user.isNew = false;
    user
      .removeFromCart(productId)
      .then(() => res.redirect("/cart"))
      .catch((err) => console.log(err));
  };

  export const getOrders: RequestHandler = (req: RequestData, res, next) => {
    const user = new User(req.user);
    user.isNew = false;
    Order.find({ "user._userId": user._id })
      .then((orders) => {
        res.render("shop/orders", {
          pageTitle: "Your Cart",
          path: "/orders",
          orders,
          isAuthenticated: req.session.isLoggedIn,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  export const postOrder: RequestHandler = (req: RequestData, res, next) => {
    const user = new User(req.user);
    user.isNew = false;
    user
      .populate("cart.items._productId")
      .then((user) => {
        const products = user.cart.items.map((item) => {
          const prod = item as CartItem;
          return { quantity: prod.quantity, product: { ...prod._productId } };
        });
        const order = new Order({
          products,
          user: { _userId: user, username: user.username, email: user.email },
        });
        order.save();
      })
      .then(() => user.clearCart())
      .then(() => {
        res.redirect("/orders");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  export const getCheckout: RequestHandler = (req: RequestData, res, next) => {
    /* res.render("shop/checkout", {
      pageTitle: "Checkout",
      path: "/checkout",
      isAuthenticated: req.session.isLoggedIn,
    }); */
  };
}

export default ShopController;
