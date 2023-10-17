import { RequestHandler } from "express";
import Cart from "../models/cart";
import Product from "../models/product";
import { UserRequest } from "../util/types";
import { products } from "../../section06/routes/admin";
import OrderItem from "../models/order-item";

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

  export const postCart: RequestHandler = (req: UserRequest, res, next) => {
    const productId = req.body.productId;
    let fetchedCart: Cart;
    let newQuantity = 1;
    req
      .user!.getCart()
      .then((cart) => {
        fetchedCart = cart;
        return cart.getProducts({
          where: { id: productId },
        });
      })
      .then((products): Promise<any> | void => {
        const product = products[0];
        if (!product) return Product.findByPk(productId);
        const oldQuantity = product.CartItem!.quantity;
        newQuantity = oldQuantity + 1;
        return Promise.resolve(product);
      })
      .then((product) => {
        return fetchedCart.addProduct(product, {
          through: { quantity: newQuantity },
        });
      })
      .then(() => res.redirect("/cart"))
      .catch((err) => console.log(err));
  };

  export const postCartDeleteItem: RequestHandler = (
    req: UserRequest,
    res,
    next
  ) => {
    const productId: string = req.body.productId;
    req
      .user!.getCart()
      .then((cart) => {
        return cart.getProducts({ where: { id: productId } });
      })
      .then((products) => {
        const product = products[0];
        return product.CartItem!.destroy();
      })
      .then((result) => res.redirect("/cart"))
      .catch((err) => console.log(err));
  };

  export const getOrders: RequestHandler = (req: UserRequest, res, next) => {
    req
      .user!.getOrders({ include: ["Products"] })
      .then((orders) => {
        //orders.forEach((order) => console.log(order.Products));
        //console.log(orders);
        res.render("shop/orders", {
          pageTitle: "Your Cart",
          path: "/orders",
          orders,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  export const postOrder: RequestHandler = (req: UserRequest, res, next) => {
    let fetchCart: Cart;
    req
      .user!.getCart()
      .then((cart) => {
        fetchCart = cart;
        return cart.getProducts();
      })
      .then((products) => {
        return req
          .user!.createOrder()
          .then((order) => {
            return order.addProducts(
              products.map((product) => {
                //@ts-ignore
                product.OrderItem = { quantity: product.CartItem!.quantity };
                return product;
              })
            );
          })
          .catch((err) => console.log(err));
      })
      .then((result) => {
        //@ts-ignore
        return fetchCart.setProducts(null);
      })
      .then(() => {
        res.redirect("/orders");
      })
      .catch((err) => console.log(err));
  };

  export const getCheckout: RequestHandler = (req, res, next) => {
    res.render("shop/checkout", {
      pageTitle: "Checkout",
      path: "/checkout",
    });
  };
}

export default ShopController;
