import { decodeJWT, isJwtExpired } from '../utils/auth';
import { setAuthorizationHeader } from '../utils/axios.config';
import { adminLoginSuccess, adminUpdatePassword } from '../reducers/admin';
import { useDispatch } from 'react-redux';

function useLocalStorageAuth() {
    const dispatch = useDispatch();
    const authToken = localStorage.getItem('auth_token');
    if (authToken) {
        const user = decodeJWT(authToken);
        if (isJwtExpired(user)) {
            localStorage.removeItem('auth_token');
            setAuthorizationHeader(null);
            return '';
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
            return '';
        }
        return user.role;
    }
    return '';
};

export default useLocalStorageAuth;