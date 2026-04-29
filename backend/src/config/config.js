import dotenv from 'dotenv'
dotenv.config();

if(!process.env.MONGO_URI){
    throw new Error('MONGO_URI is not defined ');
}

if(!process.env.JWT_SECRET){
    throw new Error("JWT_SECRET key is not defined")
}

if(!process.env.GOOGLE_CALLBACK_URL || !process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET){
    throw new Error("Google credentials required")
}

if(!process.env.IMAGEKIT_PRIVATE_KEY){
    throw new Error("ImageKit Private key required");
}

if(!process.env.BASE_URI){
    throw new Error("Base URI needer");
}

if(!process.env.MISTRAL_API_KEY){
    throw new Error("Api key is needed");
}

if(!process.env.RAZORPAY_KEY_ID){
    throw new Error("Razor pay id required")
}

if(!process.env.RAZORPAY_KEY_SECRET){
    throw new Error("Razor pay secret required");
}

export const config = {
    MONGO_URI:process.env.MONGO_URI,
    JWT_SECRET:process.env.JWT_SECRET,
    PORT:process.env.PORT,
    GOOGLE_CLIENT_ID:process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET:process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL:process.env.GOOGLE_CALLBACK_URL,
    IMAGEKIT_PRIVATE_KEY:process.env.IMAGEKIT_PRIVATE_KEY,
    BASE_URI:process.env.BASE_URI,
    MISTRAL_API_KEY:process.env.MISTRAL_API_KEY,
    RAZORPAY_KEY_ID:process.env.RAZORPAY_KEY_ID,
    RAZORPAY_KEY_SECRET:process.env.RAZORPAY_KEY_SECRET
}