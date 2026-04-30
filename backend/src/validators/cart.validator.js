import { body, validationResult, param } from 'express-validator'

const validateRequest = (req,res,next)=>{
 const error = validationResult(req);
 if(!error.isEmpty()){
  console.log(error.array())
  return res.status(400).json({ errors: error.array() });
 }
 next()
}

export const validateAddToCart = [
 param("productId").isMongoId().withMessage("Invalid product ID"),
 body("quantity").optional().isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
 validateRequest
]