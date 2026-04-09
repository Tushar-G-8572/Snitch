import express from 'express'
import morgan from 'morgan'
import authRouter from './routers/auth.routes.js';
import passport from 'passport';
import './config/google.config.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(morgan('dev'));

app.use(passport.initialize());

app.use('/api/auth', authRouter);


export default app;