import passport from "passport";
import {Strategy as GoogleStrategy} from 'passport-google-oauth20'
import { config } from "./config.js";

passport.use(new GoogleStrategy({
    clientID:config.GOOGLE_CLIENT_ID,
    clientSecret:config.GOOGLE_CLIENT_SECRET,
    callbackURL:config.GOOGLE_CALLBACK_URL,
},(accessToken,refreshToken,profile,done)=>{
    return done(null,profile)
}))

