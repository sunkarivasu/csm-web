import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
import {
    createBrowserRouter,
    RouterProvider
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import {
    AdminDashboard,
    AdminLogin,
    Admins,
    Home,
    NormalOffers,
    Offers,
    OfferUsers,
    Orders,
    Products,
    Requests,
} from './screens';
import {
    ProtectedRoute
} from './components';
import { setAxiosDefaults } from './utils/axios.config';
import Categories from './screens/Categories';
import Requests from './screens/Requests';
const router = createBrowserRouter([
    {
        path: '/',
        element: <Home />
    },
    {
        path: '/admin',
        element: <ProtectedRoute role={['admin']}><AdminDashboard /></ProtectedRoute>,
        element: <AdminDashboard />,
        children: [
            {
                path: '/admin/admins',
                element: <ProtectedRoute role={['super_admin']}><Admins /></ProtectedRoute>
            },
            {
                path: '/admin/orders',
                element: <Orders/>
            },
            {
                path: '/admin/products',
                element: <Products />
            },
            {
                path: '/admin/categories',
                element: <Categories />
            },
            {
                path: '/admin/offers',
                element: <Offers />
            },
            {
                path: '/admin/normal-offers',
                element: <NormalOffers />
            },
            {
                path:'/admin/offer-users',
                element: <OfferUsers />
            },
            {
                path: '/admin/requests',
                element: <Requests />
            }
        ]
    },
    {
        path: '/admin/login',
        element: <AdminLogin />
    }
]);

const App = () => {
    useEffect(() => {
        setAxiosDefaults();
    }, []);

    return (
        <>
            <RouterProvider router={router} />
            <ToastContainer
                position='bottom-right'
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme='light'
            />
        </>
    );
};

export default App;