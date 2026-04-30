import { body, validationResult } from 'express-validator'

function validationRequest(req, res, next) {
 const errors = validationResult(req);

 if (!errors.isEmpty()) {
  return res.status(400).json({ success: false, message: "Validation Error", error: errors.array() })
 }

 next();
}

export const productValidation = [
 body('title').notEmpty().withMessage("Title is required"),
 body('description').notEmpty().withMessage("Description is required"),
 body("priceAmount").isNumeric().withMessage("Price amount must be a number"),
 body("priceCurrency").notEmpty().withMessage("Price currency is required"),
 validationRequest
]

