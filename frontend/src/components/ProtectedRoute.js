import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { decodeJWT, isJwtExpired } from '../utils/auth';
import { setAuthorizationHeader } from '../utils/axios.config';
import { adminLoginSuccess, adminUpdatePassword } from '../reducers/admin';
import { useDispatch } from 'react-redux';
import Loading from './Loading';

const ProtectedRoute = (props) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const admin = useSelector(state => state.admin);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const AuthenticateFromLocalStorage = () => {
        const authToken = localStorage.getItem('auth_token');
        if (authToken) {
            const user = decodeJWT(authToken);
            if (isJwtExpired(user)) {
                localStorage.removeItem('auth_token');
                setAuthorizationHeader(null);
                return false;
            }
            setAuthorizationHeader(authToken);
            if (user.role === 'admin' || user.role === 'super_admin') {
                if (user.allow_password_change) {
                    dispatch(adminUpdatePassword(user));
                } else {
                    dispatch(adminLoginSuccess(user));
                }
            } else if (user.role === 'user') {
                // dispatch(userLoginSuccess(user));
            } else {
                return false;
            }
            return user.role;
        }
        return false;
    };

    useEffect(() => {
        if (props.role.includes('super_admin')) {
            if (!admin.isAuthenticated) {
                const role = AuthenticateFromLocalStorage();
                if (role === 'super_admin') {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                    navigate('/admin/login');
                }
            } else if (admin.user.role === 'super_admin') {
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
                navigate('/admin')
            }
        } else if (props.role.includes('admin')) {
            if (!admin.isAuthenticated) {
                const role = AuthenticateFromLocalStorage();
                if (role === 'admin' || role === 'super_admin') {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                    navigate('/admin/login');
                }
            } else {
                setIsAuthenticated(true);
            }
        }

        // Other Roles
    }, []);

    return isAuthenticated ? <>{props.children}</> : <Loading />;
};

export default ProtectedRoute;