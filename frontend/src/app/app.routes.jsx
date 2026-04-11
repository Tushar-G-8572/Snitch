import { createBrowserRouter } from "react-router";
import { LoginPage } from "../auth/pages/LoginPage";
import {RegisterPage} from '../auth/pages/RegisterPage';

export const router = createBrowserRouter([
    {
        path:'/',
        element:<h1>Hello</h1>
    },
    {
        path:'/login',
        element:<LoginPage />
    },
    {
        path:'/register',
        element:<RegisterPage />
    }
])