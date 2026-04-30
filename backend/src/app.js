import express from 'express'
import morgan from 'morgan'
import authRouter from './routers/auth.routes.js';
import passport from 'passport';
import './config/google.config.js';
import cookieParser from 'cookie-parser'
import productRouter from './routers/product.routes.js';
import cartRouter from './routers/cart.routes.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(morgan('dev'));
app.use(cookieParser());

app.use(passport.initialize());

app.use('/api/auth', authRouter);
app.use('/api/product',productRouter);
app.use('/api/cart',cartRouter);

export default app;