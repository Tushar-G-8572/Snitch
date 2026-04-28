import { Router } from "express";
import { authUserMiddleware } from "../middleware/auth.middleware.js";
import { validateAddToCart } from "../validators/cart.validator.js";
import { addToCart, getAddToCartProduct, removeAddToCartProduct, updateCartProductQuantity } from "../controller/cart.controller.js";

const cartRouter = Router();

cartRouter.post('/add/:productId',authUserMiddleware,validateAddToCart,addToCart)

cartRouter.get('/',authUserMiddleware,getAddToCartProduct);

cartRouter.patch(`/item/:itemId`,authUserMiddleware,updateCartProductQuantity);

cartRouter.delete('/item/:itemId',authUserMiddleware,removeAddToCartProduct);

export default cartRouter;