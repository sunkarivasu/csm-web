import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
import {
    createBrowserRouter,
    RouterProvider
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import {
    Home,
    AdminDashboard,
    AdminLogin,
    ManageAdmins,
    ManageCategories,
    ManageSubcategories,
    ManageProducts
} from './screens';
import {
    ProtectedRoute
} from './components';
import { setAxiosDefaults } from './utils/axios.config';
const router = createBrowserRouter([
    {
        path: '/',
        element: <Home />
    },
    {
        path: '/admin',
        element: <ProtectedRoute role={['admin']}><AdminDashboard /></ProtectedRoute>,
        children: [
            {
                path: '/admin/manage-admins',
                element: <ProtectedRoute role={['super_admin']}><ManageAdmins /></ProtectedRoute>
            },
            {
                path: '/admin/manage-categories',
                element: <ManageCategories />
            },
            {
                path: '/admin/manage-subcategories',
                element: <ManageSubcategories />
            },
            {
                path: '/admin/manage-products',
                element: <ManageProducts />
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