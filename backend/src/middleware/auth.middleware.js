import jwt from 'jsonwebtoken'
import { config } from "../config/config.js";
import { generateAccessToken } from '../utils/token.utility.js';
import userModel from '../models/user.model.js';

export async function authUserMiddleware(req, res, next) {
    try {

        // const token = req.cookies.token;
        const accessToken = req.cookies.accessToken;
        const refreshToken = req.cookies.refreshToken

        // if(!token) return res.status(400).json({success:false,message:"Token needed"});
        if (!accessToken && !refreshToken) {
            return res.status(401).json({ success: false, message: "Not authenticated" });
        }

        if (accessToken) {
            try {
                const decoded = jwt.verify(accessToken, config.JWT_SECRET);
                req.user = {
                    id: decoded.id,
                    role: decoded.role
                }
                return next();
            } catch (err) {
                // Access token expired → fall through to refresh token check
                if (err.name !== "TokenExpiredError") {
                    return res.status(401).json({ success: false, message: "Invalid token" });
                }
            }
        }

         if (!refreshToken) {
            return res.status(401).json({ success: false, message: "Session expired, please login" });
        }

         const decoded = jwt.verify(refreshToken, config.REFRESH_TOKEN_JWT_SECRET);

         const user = await userModel.findById(decoded.id);
        if (!user || user.refreshToken !== refreshToken) {
            return res.status(401).json({ success: false, message: "Invalid session, please login" });
        }

        const newAccessToken = generateAccessToken({ id: user._id, role:user.role });

        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: config.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000
        });

        req.user = { id: user._id, role:user.role };
        return next();

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Middleware Error" });
    }
}
