import { body,validationResult } from "express-validator";

const validate = (req,res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    next();
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

export const registerValidator = [
    body('username').notEmpty().withMessage("Username is required"),
    body('fullName').notEmpty().withMessage("Full name is required"),
    body('email').matches(emailRegex).withMessage("Please use a valid email"),
    body('password').matches(passwordRegex).withMessage("Password must be at least 6 characters long and contain at least one letter and one number"),
    body('role').optional().isIn(['Buyer', 'Seller']).withMessage("Role must be either Buyer or Seller"),
    validate
]

export const loginValidator = [
    body('email').matches(emailRegex).withMessage("Please use a valid email"),
    body('password').notEmpty().withMessage("Password is required"),
    validate
]