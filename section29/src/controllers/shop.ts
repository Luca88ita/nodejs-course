import { RequestHandler } from "express";
const Stripe = require("stripe");
import dotenv from "dotenv";
import { CartItem, ExtendedError, RequestData } from "../util/types";
import Product, { ProductType } from "../models/product";
import User from "../models/user";
import Order from "../models/order";
import PDFModel from "../templates/pdf/invoice";

dotenv.config();
const stripe = Stripe(process.env.SK);

namespace ShopController {
  export const getProducts: RequestHandler = (req: RequestData, res, next) => {
    const page: number = req.query.page ? +req.query.page : 1;
    const itemsPerPage = +process.env.ITEMS_PER_PAGE!;
    let totalProducts: number = 0;

    Product.countDocuments()
      .then((prodNumber) => {
        totalProducts = prodNumber;
        return Product.find()
          .skip((page - 1) * itemsPerPage)
          .limit(itemsPerPage);
      })
      .then((products) => {
        if (!products || products.length <= 0) return res.redirect("/400");
        res.render("shop/product-list", {
          products,
          pageTitle: "All Products",
          path: "/products",
          totalProducts,
          currentPage: page,
          hasNextPage: itemsPerPage * page < totalProducts,
          hasPreviousPage: page > 1,
          nextPage: page + 1,
          previousPage: page - 1,
          lastPage: Math.ceil(totalProducts / itemsPerPage),
        });
      })
      .catch((err) => {
        const error: ExtendedError = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  };

  export const getProduct: RequestHandler = (req: RequestData, res, next) => {
    const productId: string = req.params.productId;
    Product.findById(productId)
      .then((product) => {
        if (!product) return res.redirect("/400");
        console.log(product);
        const updateImageUrl = "/" + product.imageUrl;
        product.imageUrl = updateImageUrl;
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

  export const getIndex: RequestHandler = (req: RequestData, res, next) => {
    const page: number = req.query.page ? +req.query.page : 1;
    const itemsPerPage = +process.env.ITEMS_PER_PAGE!;
    let totalProducts: number = 0;
    Product.find()
      .countDocuments()
      .then((prodNumber) => {
        totalProducts = prodNumber;
        return Product.find()
          .skip((page - 1) * itemsPerPage)
          .limit(itemsPerPage);
      })
      .then((products) => {
        if (!products || products.length <= 0) return res.redirect("/400");
        res.render("shop/index", {
          products,
          pageTitle: "Shop",
          path: "/",
          totalProducts,
          currentPage: page,
          hasNextPage: itemsPerPage * page < totalProducts,
          hasPreviousPage: page > 1,
          nextPage: page + 1,
          previousPage: page - 1,
          lastPage: Math.ceil(totalProducts / itemsPerPage),
        });
      })
      .catch((err) => {
        const error: ExtendedError = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  };

  export const getCart: RequestHandler = async (
    req: RequestData,
    res,
    next
  ) => {
    try {
      const user = new User(req.user);
      user.isNew = false;
      let totalPrice = 0;
      const availableProducts: CartItem[] = [];
      const populatedUser = await user.populate("cart.items._productId");
      const products: CartItem[] = populatedUser.cart.items;
      if (products.length > 0) {
        await Promise.all(
          products.map(async (product) => {
            const p = await Product.findById(product._productId);
            if (p) {
              const productDetails: ProductType =
                product._productId as ProductType;
              totalPrice =
                totalPrice + productDetails.price * product.quantity!;
              availableProducts.push(product);
            }
          })
        );
      }
      populatedUser.cart.items = availableProducts;
      await populatedUser.save();
      res.render("shop/cart", {
        pageTitle: "Your Cart",
        path: "/cart",
        products: availableProducts,
        totalPrice: totalPrice.toFixed(2),
      });
    } catch (err) {
      const error: ExtendedError = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    }
  };

  export const postCart: RequestHandler = (req: RequestData, res, next) => {
    const productId = req.body.productId;
    const user = new User(req.user);
    user.isNew = false;
    Product.findById(productId)
      .then((product) => {
        return user.addToCart(product as ProductType);
      })
      .then(() => res.redirect("/cart"))
      .catch((err) => {
        const error: ExtendedError = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
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
      .catch((err) => {
        const error: ExtendedError = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
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
        });
      })
      .catch((err) => {
        const error: ExtendedError = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  };

  export const postOrder: RequestHandler = async (
    req: RequestData,
    res,
    next
  ) => {
    try {
      const user = new User(req.user);
      user.isNew = false;
      const populatedUser = await user.populate("cart.items._productId");
      const orderProducts: any[] = [];

      await Promise.all(
        populatedUser.cart.items.map(async (item) => {
          const p = await Product.findById(item._productId);
          if (p) {
            const prod = item as CartItem;
            orderProducts.push({
              quantity: prod.quantity,
              product: { ...prod._productId },
            });
          }
        })
      );
      const order = new Order({
        products: orderProducts,
        user: { _userId: user, email: user.email },
      });
      await order.save();
      await populatedUser.clearCart();
      res.redirect("/orders");
    } catch (err) {
      const error: ExtendedError = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    }
  };

  export const getInvoice: RequestHandler = (req: RequestData, res, next) => {
    const orderId = req.params.orderId;
    Order.findById(orderId)
      .then((order) => {
        if (!order) return next(new Error("Unable to find the order"));
        if (order.user._userId.toString() !== req.user?._id.toString())
          return next(new Error("Unauthorized!"));
        PDFModel.getPDFInvoice(res, order);
      })
      .catch((err) => {
        const error: ExtendedError = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  };

  export const getCheckout: RequestHandler = (req: RequestData, res, next) => {
    const user = new User(req.user);
    user.isNew = false;
    let products: CartItem[];
    let totalPrice = 0;

    user
      .populate("cart.items._productId")
      .then((user) => {
        products = user.cart.items;

        if (products.length === 0)
          return next(new Error("Oops! It seems the cart is empty"));

        products.forEach((product) => {
          const productDetails: ProductType = product._productId as ProductType;
          totalPrice = totalPrice + productDetails.price * product.quantity!;
        });
        return stripe.checkout.sessions.create({
          line_items: products.map((product) => {
            const productDetails: ProductType =
              product._productId as ProductType;
            return {
              price_data: {
                currency: "usd",
                unit_amount: Math.ceil(+productDetails.price * 100),
                product_data: {
                  name: productDetails.title,
                  description: productDetails.description,
                },
              },
              quantity: product.quantity,
            };
          }),
          mode: "payment",
          success_url: `${req.protocol}://${req.get("host")}/checkout/success`,
          cancel_url: `${req.protocol}://${req.get("host")}/checkout/cancel`,
        });
      })
      .then((session) => {
        res.render("shop/checkout", {
          pageTitle: "Checkout",
          path: "/checkout",
          products: products,
          totalPrice: totalPrice.toFixed(2),
          sessionId: session.id,
        });
      })
      .catch((err) => {
        console.log(err);
        const error: ExtendedError = new Error(err);
        console.log(error);
        error.httpStatusCode = 500;
        return next(error);
      });
  };

  export const getCheckoutSuccess: RequestHandler = (
    req: RequestData,
    res,
    next
  ) => {
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
          user: { _userId: user, email: user.email },
        });
        order.save();
      })
      .then(() => user.clearCart())
      .then(() => {
        res.redirect("/orders");
      })
      .catch((err) => {
        const error: ExtendedError = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  };

  export const getCheckoutCancel: RequestHandler = (
    req: RequestData,
    res,
    next
  ) => {
    res.render("shop/checkout-cancel", {
      pageTitle: "Checkout canceled",
      path: "/checkout/cancel",
    });
  };

  export const getHealt: RequestHandler = (req: RequestData, res, next) => {
    res.redirect("/");
  };
}

export default ShopController;
