import { createBrowserRouter } from "react-router";
import { LoginPage } from "../feature/auth/pages/LoginPage";
import { RegisterPage } from '../feature/auth/pages/RegisterPage';
import { Dashboard } from '../shared/components/Dashboard';

export const router = createBrowserRouter([
    {
        path:'/',
        element:<Dashboard />
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