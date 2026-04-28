import userModel from "../models/user.model.js";
import jwt from 'jsonwebtoken';
import { config } from "../config/config.js";

function createToken(id, role) {
    const token = jwt.sign({ id: id, role: role }, config.JWT_SECRET, { expiresIn: '2d' });
    return token;
}

export async function registerController(req, res) {
    try {
        const { username, fullName, email, password, role } = req.body;
        const isEmailAlreadyExists = await userModel.findOne({ $or: [{ email }, { username }] });
        if (isEmailAlreadyExists) return res.status(400).json({ success: false, message: "User already exists" })
        const user = await userModel.create({ username, fullName, email, password, role });

        const token = createToken(user._id, user.role);

        res.cookie('token', token);

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

        const token = createToken(user._id, user.role);

        res.cookie('token', token);

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

export async function get_MEController(req,res) {
    try{

        const id = req.user.id;
        
        const user = await userModel.findOne({_id:id});

    if(!user){
        return res.status(404).json({success:false,message:"user not found"})
    }

    return res.status(200).json({success:true,message:"USer fetched",user:user})
}catch(error){
    console.error(error);
    return res.status(500).json({success:false,message:"Error while fetching user"});
}
}

export async function handleGooleSignupAndLogin(req,res) {
    try{
        const {sub,given_name,name,email} = req.user._json;
        const user = await userModel.findOne({email});
        if(user){
            const token = createToken(user._id,user.role);
            res.cookie('token', token);
            res.redirect(config.BASE_URI);
            return res.status(200).json({success:true,message:"User logged in successfully"})
        }
        const userName = given_name.split(' ').join('').toLocaleLowerCase() + sub.split('').reverse().join('').substring(0,5);
        const newUser = userModel.create({
            fullName:name,
            email:email,
            username:userName,
        })
        const token = createToken(newUser._id,newUser.role);
        res.cookie('token', token);
        res.redirect(config.BASE_URI);
        return res.status(201).json({success:true,message:"User Signed Up successfully"})

    }catch(error){
        console.log(error);
        return res.status(500).json({success:false,message:"Error while google authentication"})
    }
}

export async function changeRoleController(req,res) {
    try{

        const token = req.user.id;
        if(!token){
        return res.status(401).json({success:false,message:"Unauthorized"})
    }
    const {role} = req.body;
    if(!role || (role !== 'Seller' && role !== 'Buyer')){
        return res.status(400).json({success:false,message:"Invalid role"})
    }
    const user = await userModel.findById(token);
    if(!user){
        return res.status(404).json({success:false,message:"User not found"})
    }
    user.role = role;
    await user.save();
    return res.status(200).json({success:true,message:"Role updated successfully"})
}catch(error){
    console.error(error);
    return res.status(500).json({success:false,message:"Error while changing role"})
}
}

export async function handleLogoutController(req,res) {
    try{

        const userId = req.user.id;
        if(!userId){
            return res.status(400).json({success:false,message:"User id needed"});
        }
        res.clearCookie("token");
        return res.status(200).json({success:true,message:"user logged out"}) 

    }catch(error){
        console.error(error)
        return res.status(500).json({success:false,message:"Error while logout user"});
    }
}