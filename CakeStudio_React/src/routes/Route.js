import RegisterComponent from "../components/RegisterComponent/RegisterComponent";
import About from "../pages/AboutUs/About";
import Cakes from "../pages/Cakes/Cakes";
import Category from "../pages/Categories/Category";
import { Contact } from "../pages/Contact/Contact";
import CustomCakes from "../pages/CustomCakes/CustomCakes";
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Occasions from "../pages/Ocassions/Ocassion";
import OccasionList from "../pages/Ocassions/OcassionList";
import Offers from "../pages/Offers/Offers";
import ProductDetails from "../pages/ProductDetails/ProductDetails";
import Cart from "../pages/Cart/Cart"
import Checkout from "../pages/Checkout/Checkout"
import OrderSuccess from "../pages/OrderSuccess/OrderSuccess";
import NotFound from "../pages/NotFound/NotFound";
import MyAccounts from "../pages/MyAccount/MyAccounts";
import Order from "../pages/MyAccount/Order";
import OrderDetail from "../pages/MyAccount/OrderDetail";
import Address from "../pages/MyAccount/Address";
import Wishlists from "../pages/MyAccount/Wishlists";
import AccountSetting from "../pages/MyAccount/AccountSetting";
import PaymentSuccess from "../pages/Payment/PaymentSuccess";
import PaymentCancel from "../pages/Payment/PaymentCancel";
import ForgotPassword from "../pages/ForgotPassword/ForgotPasswordPages"
import ResetPassword from "../pages/ForgotPassword/ResetPasswordPages";

const route = [
    { path: '/login', name: 'LogIn', component: Login, element: Login },
    { path: '/register', name: 'Register', component: RegisterComponent, element: RegisterComponent },
    { path: '/', name: 'Home', component: Home, element: Home },
    { path: '/cakes', name: 'Cakes', component: Cakes, element: Cakes },
    { path: '/categories', name: 'Categories', component: Category, element: Category },
    { path: '/occasions', name: 'Occasions', component: Occasions, element: Occasions },
    { path: '/occasions/:slug', name: 'OccasionsList', component: OccasionList, element: OccasionList },
    { path: '/custom-cakes', name: 'CustomCakes', component: CustomCakes, element: CustomCakes },
    { path: '/offers', name: 'Offers', component: Offers, element: Offers },
    { path: '/about', name: 'About', component: About, element: About },
    { path: '/contact', name: 'Contact', component: Contact, element: Contact },
    { path: '/product/:id', name: 'ProductDetails', component: ProductDetails, element: ProductDetails },
    { path: '/cart', name: 'Cart', component: Cart, element: Cart },
    { path: '/checkout', name: 'Checkout', component: Checkout, element: Checkout },
    { path: '/ordersuccess/:orderId', name: 'OrderSuccess', component: OrderSuccess, element: OrderSuccess },

    { path: '/my-account', name: 'MyAccount', component: MyAccounts, element: MyAccounts },
    { path: '/my-account/orders', name: 'OrdersList', component: Order, element: Order },
    { path: '/my-account/orders/:orderId', name: 'OrdersDetails', component: OrderDetail, element: OrderDetail },
    { path: '/my-account/addresses', name: 'Address', component: Address, element: Address },
    { path: '/my-account/wishlist', name: 'Wishlists', component: Wishlists, element: Wishlists },
    { path: '/my-account/settings', name: 'settings', component: AccountSetting, element: AccountSetting },
    { path: "/payment/success", name: "PaymentSuccess", component: PaymentSuccess, element: PaymentSuccess},
    { path: "/payment/cancel", name: "PaymentCancel", component: PaymentCancel, element: PaymentCancel},

    { path: "/forgot-password", name: "ForgotPassword", component: ForgotPassword, element: ForgotPassword},
    { path: "/reset-password", name: "ResetPassword", component: ResetPassword, element: ResetPassword},
    
    // Always keep this last
    { path: "*", component: NotFound }
]
export default route;