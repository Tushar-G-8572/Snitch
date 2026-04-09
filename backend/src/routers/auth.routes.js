import { Router } from "express";
const authRouter = Router();
import { registerValidator, loginValidator } from "../validators/auth.validator.js";
import { registerController, loginController,  get_MEController } from "../controller/auth.controller.js";
import passport from "passport";
import { authUser_RoleMiddleware } from "../middleware/auth.middleware.js";

authRouter.post('/register', registerValidator, registerController)

authRouter.post('/login', loginValidator, loginController);

authRouter.get('/get-me',authUser_RoleMiddleware,get_MEController);

export default authRouter;