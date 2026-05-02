import { config } from "../config/config.js";
import jwt from 'jsonwebtoken';

export function generateAccessToken(payload){
 return jwt.sign(payload,config.JWT_SECRET,{expiresIn:'15m'})
}

export function generateRefreshToken(payload){
 return jwt.sign(payload,config.REFRESH_TOKEN_JWT_SECRET,{expiresIn:"7d"})
}