import dotenv from 'dotenv'
dotenv.config();

if(!process.env.MONGO_URI){
    throw new Error('MONGO_URI is not defined ');
}

if(!process.env.JWT_SECRET){
    throw new Error("JWT_SECRET key is not defined")
}

export const config = {
    MONGO_URI:process.env.MONGO_URI,
    JWT_SECRET:process.env.JWT_SECRET,
    PORT:process.env.PORT,
    GOOGLE_CLIENT_ID:process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET:process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL:process.env.GOOGLE_CALLBACK_URL
}