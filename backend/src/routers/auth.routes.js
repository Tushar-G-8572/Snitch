import { Router } from "express";
const authRouter = Router();
import { registerValidator, loginValidator } from "../validators/auth.validator.js";
import { registerController, loginController,  get_MEController,handleGoogleSignupAndLogin, changeRoleController, handleLogoutController, handleUpdateUser } from "../controller/auth.controller.js";
import passport from "passport";
import { authUserMiddleware } from "../middleware/auth.middleware.js";

authRouter.post('/register', registerValidator, registerController)

authRouter.post('/login', loginValidator, loginController);

authRouter.get('/get-me',authUserMiddleware,get_MEController);

authRouter.get('/google',passport.authenticate('google',{scope:["profile","email"]}))

authRouter.get('/google/callback',passport.authenticate('google',{session:false,failureRedirect:"/"}),handleGoogleSignupAndLogin)

authRouter.post('/change-role',authUserMiddleware,changeRoleController);

authRouter.get('/logout',authUserMiddleware,handleLogoutController);

authRouter.post('/update/profile',authUserMiddleware,handleUpdateUser);


export default authRouter;