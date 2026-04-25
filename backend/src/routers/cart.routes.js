import { Router } from "express";
import { authUserMiddleware } from "../middleware/auth.middleware.js";
import { validateAddToCart } from "../validators/cart.validator.js";
import { addToCart, getAddToCartProduct } from "../controller/cart.controller.js";

const cartRouter = Router();

cartRouter.post('/add/:productId',authUserMiddleware,validateAddToCart,addToCart)

cartRouter.get('/',authUserMiddleware,getAddToCartProduct)

export default cartRouter;