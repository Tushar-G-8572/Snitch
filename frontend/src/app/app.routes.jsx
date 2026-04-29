import { createBrowserRouter } from "react-router";
import { LoginPage } from "../feature/auth/pages/LoginPage";
import { RegisterPage } from '../feature/auth/pages/RegisterPage';
import CreateProduct from "../feature/product/pages/CreateProduct";
import EditProduct from "../feature/product/pages/EditProduct";
import Dashboard from "../feature/product/pages/DashBoard";
import Home from "../feature/product/pages/HomePage";
import Protected from "../feature/product/components/Protected";
import ProductDetailPage from "../feature/product/components/ProductDetailPage";
import AddToCartPage from "../feature/product/pages/AddToCartPage";
import WishListPage from "../feature/product/pages/WishListPage";
import ProfilePage from "../feature/shared/pages/ProfilePage";
import OrdersPage from "../feature/shared/pages/OrdersPage";
import Negotiation from "../feature/product/AI/Negotiation";

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
        path:`/cart-items`,
        element: <AddToCartPage />
    },
    {
        path:'/wishlist',
        element:<WishListPage />
    },
    {
        path:'/profile',
        element:<ProfilePage />
    },
    {
        path:'/orders',
        element:<OrdersPage />
    },
    {
        path:'/negotiate',
        element:<Negotiation />
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
            },
            {
                path:'/seller/edit-product/:productId',
                element:<Protected role="Seller" >
                    <EditProduct />
                </Protected>
            }
        ]
    }   
])