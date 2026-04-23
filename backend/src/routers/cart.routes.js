import { Router } from "express";
import { authUserMiddleware } from "../middleware/auth.middleware.js";
import { addToCart, getAddToCartProduct } from "../controller/cart.controller.js";

const cartRouter = Router();

cartRouter.post('/add/:productId',authUserMiddleware,addToCart)

cartRouter.get('/',authUserMiddleware,getAddToCartProduct)

export default cartRouter;