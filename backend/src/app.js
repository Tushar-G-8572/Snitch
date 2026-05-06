import express from 'express'
import morgan from 'morgan'
import authRouter from './routers/auth.routes.js';
import passport from 'passport';
import './config/google.config.js';
import cookieParser from 'cookie-parser'
import productRouter from './routers/product.routes.js';
import cartRouter from './routers/cart.routes.js';
import path from 'path'
import { fileURLToPath } from 'url';


const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,'..','public')));
app.use(morgan('dev'));
app.use(cookieParser());

app.use(passport.initialize());

app.use('/api/auth', authRouter);
app.use('/api/product',productRouter);
app.use('/api/cart',cartRouter);

app.use('*name',(req,res)=>{
 res.sendFile(path.join(__dirname,'..','public','index.html'));
})

export default app;