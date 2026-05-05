import userModel from "../models/user.model.js";
import jwt from 'jsonwebtoken';
import { config } from "../config/config.js";
import redis from "../config/cache.config.js";
import { generateAccessToken, generateRefreshToken } from '../utils/token.utility.js'

export async function registerController(req, res) {
    try {
        const { username, fullName, email, password, role } = req.body;
        const isEmailAlreadyExists = await userModel.findOne({ $or: [{ email }, { username }] });
        if (isEmailAlreadyExists) return res.status(400).json({ success: false, message: "User already exists" })
        const user = await userModel.create({ username, fullName, email, password, role });

        // const token = createToken(user._id, user.role);
        const payload = {user:user._id,role:user.role}
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        user.refreshToken = refreshToken;
        await user.save();

        // res.cookie('refreshToken', token);

         res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: config.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000           // 15 minutes
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: config.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days
        });

        res.status(201).json({
            success: true, message: "User registered successfully", user: {
                id: user._id,
                username: user.username,
                fullName: user.fullName,
                email: user.email,
                role: user.role
            }
        })
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" })
    }
}

export async function loginController(req, res) {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email }).select('+password');
        if (!user) return res.status(400).json({ success: false, message: "Invalid email or password" })
        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) return res.status(400).json({ success: false, message: "Invalid email or password" })

        // const token = createToken(user._id, user.role);
        const payload = {id:user._id, role:user.role}
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        user.refreshToken = refreshToken;
        await user.save();

        await redis.set(user._id.toString(), JSON.stringify(user), 'EX', 60 * 60 * 24)

        // res.cookie('token', token);
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: config.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000           // 15 minutes
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: config.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days
        });

        res.status(200).json({
            success: true, message: "User logged in successfully", user: {
                id: user._id,
                username: user.username,
                fullName: user.fullName,
                email: user.email,
                role: user.role
            }
        })
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" })
    }
}

export async function get_MEController(req, res) {
    try {

        const id = req.user.id;

        const cachedData = await redis.get(id);

        if (cachedData) {
            const parsedData = JSON.parse(cachedData);
            return res.status(200).json({
                success: true,
                message: "User fetched (Redis)",
                user: {
                    id: parsedData._id,
                    username: parsedData.username,
                    fullName: parsedData.fullName,
                    email: parsedData.email,
                    role: parsedData.role
                }
            })
        }

        const user = await userModel.findOne({ _id: id });

        if (!user) {
            return res.status(404).json({ success: false, message: "user not found" })
        }

        await redis.setex(id, 60 * 60 * 24, JSON.stringify(user));

        return res.status(200).json({ success: true, message: "User fetched (DB) ", user: user })

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Error while fetching user" });
    }
}

export async function handleGoogleSignupAndLogin(req, res) {
    try {
        const { sub, given_name, name, email } = req.user._json;

        let user = await userModel.findOne({ email });

        // ─── New User → Create account ───────────────────────────────
        if (!user) {
            const userName =
                given_name.split(' ').join('').toLocaleLowerCase() +
                sub.split('').reverse().join('').substring(0, 5);

            user = await userModel.create({   // ✅ await added
                fullName: name,
                email: email,
                username: userName,
            });
        }

        // ─── Generate both tokens (same for login & signup) ──────────
        const payload = { id: user._id, role: user.role };

        const accessToken  = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        // Save refresh token in DB
        user.refreshToken = refreshToken;
        await user.save();

        // Cache user in Redis
        await redis.setex(user._id.toString(), 60 * 60 * 24, JSON.stringify(user));

        // Set cookies
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: config.NODE_ENV === "production",
            sameSite: "lax",        // ⚠️ lax (not strict) — needed for OAuth redirect
            maxAge: 15 * 60 * 1000
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: config.NODE_ENV === "production",
            sameSite: "lax",        // ⚠️ lax (not strict) — needed for OAuth redirect
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.redirect(config.BASE_URI);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Error while google authentication" });
    }
}

export async function changeRoleController(req, res) {
    try {

        const userId = req.user.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" })
        }
        const { role } = req.body;
        if (!role || (role !== 'Seller' && role !== 'Buyer')) {
            return res.status(400).json({ success: false, message: "Invalid role" })
        }
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" })
        }
        user.role = role;
        await user.save();
        return res.status(200).json({ success: true, message: "Role updated successfully" })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Error while changing role" })
    }
}

export async function handleLogoutController(req, res) {
    try {

        const userId = req.user.id;
        const refreshToken = req.cookies.refreshToken;
        if (!userId) {
            return res.status(400).json({ success: false, message: "User id needed" });
        }

        if (refreshToken) {
            // Remove from DB
            await userModel.findOneAndUpdate(
                { refreshToken },
                { $unset: { refreshToken: 1 } }
            );
        }

        await redis.del(userId.toString());

        // res.clearCookie("token");
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        return res.status(200).json({ success: true, message: "user logged out" })

    } catch (error) {
        console.error(error)
        return res.status(500).json({ success: false, message: "Error while logout user" });
    }
}