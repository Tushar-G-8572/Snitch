import { Router } from "express";
import { authUserMiddleware } from "../middleware/auth.middleware.js";
import { validateAddToCart } from "../validators/cart.validator.js";
import { addToCart, getAddToCartProduct, createOrderController,handleGetOrders, removeAddToCartProduct, updateCartProductQuantity, verifyPaymentOrder } from "../controller/cart.controller.js";

const cartRouter = Router();

cartRouter.post('/add/:productId',authUserMiddleware,validateAddToCart,addToCart)

cartRouter.get('/',authUserMiddleware,getAddToCartProduct);

cartRouter.patch(`/item/:itemId`,authUserMiddleware,updateCartProductQuantity);

cartRouter.delete('/item/:itemId',authUserMiddleware,removeAddToCartProduct);

cartRouter.post('/payment/create/order',authUserMiddleware,createOrderController);

cartRouter.post('/payment/varify/order',authUserMiddleware,verifyPaymentOrder)

cartRouter.get('/order',authUserMiddleware,handleGetOrders);

export default cartRouter;