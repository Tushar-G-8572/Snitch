import { createBrowserRouter } from "react-router";
import { LoginPage } from "../feature/auth/pages/LoginPage";
import { RegisterPage } from '../feature/auth/pages/RegisterPage';
import HomePage from "../shared/pages/HomePage";
import CreateProduct from "../feature/product/pages/CreateProduct";
import Dashboard from "../feature/product/pages/DashBoard";
import Home from "../feature/product/pages/HomePage";
import Protected from "../feature/product/components/Protected";
import ProductDetailPage from "../feature/product/components/ProductDetailPage";

export const router = createBrowserRouter([
    {
        path:'/',
        element:<Home />
    },
    {
        path:'/login',
        element:<LoginPage />
    },
    {
        path:'/register',
        element:<RegisterPage />
    },
    {
        path:`/product/:productId`,
        element: <ProductDetailPage />
    },
    {
        path:'/seller',
        children:[
            {
                path:'/seller/create-product',
                element: <Protected role="Seller" >
                    <CreateProduct />
                </Protected>
            },
            {
                path:'/seller/dashboard',
                element:<Protected role="Seller" >
                    <Dashboard />
                </Protected>
            }
        ]
    }   
])