import jwt from 'jsonwebtoken'
import { config } from "../config/config.js";

export async function authUserMiddleware(req,res,next){
    try{

        const token = req.cookies.token;
        if(!token) return res.status(400).json({success:false,message:"Token needed"});
        
        const decoded = jwt.verify(token,config.JWT_SECRET);
        req.user = {
            id:decoded.id,
            role:decoded.role
        }
        next();
    }catch(error){
        console.error(error);
        return res.status(500).json({success:false,message:"Middleware Error"});
    }
}
