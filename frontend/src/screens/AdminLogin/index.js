/** 
 * TODO: This code can be cleaned further...
 * I    1. state variables can be grouped
 *      2. validation logic can be moved to a separate file
 *      3. async-await can be used instead of then-catch
 *      4. formType-otp can be removed
 * II   1. implement OAuth
 *      2. move all constants to a separate file
 *      3. Add Better comments
 * */
import React, { useState, useEffect } from 'react';
import { InlineText, Input } from '../../components';
import { useDispatch, useSelector } from 'react-redux';
import { adminClearErrors, adminLoginSuccess, adminUpdatePassword, adminLoginFail, adminLoginRequest } from '../../reducers/admin';
import './AdminLogin.css';
import { toast } from 'react-toastify';
import { adminLogin, forgotAdminPassword, resetAdminPassword, updateAdminPassword } from '../../api/admin';
import { decodeJWT, isJwtExpired } from '../../utils/auth';
import { setAuthorizationHeader } from '../../utils/axios.config';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, errors, user: adminUser, isAuthenticated } = useSelector(state => state.admin);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [formType, setFormType] = useState('login');
    const [hash, setHash] = useState('');

    const handleSubmit = e => {
        e.preventDefault();
        dispatch(adminLoginRequest());

        // Validation
        let errors = {};
        if (formType === 'login') {
            if (!password) {
                errors.password = 'Password is required';
            }
            if (!email) {
                errors.email = 'Email is required';
            }
        } else if (formType === 'updatePassword') {
            if (!password) {
                errors.password = 'Password is required';
            }
            if (password !== confirmPassword) {
                errors.confirmPassword = 'Passwords do not match';
                errors.password = 'Passwords do not match';
            }
        } else if (formType === 'forgotPassword') {
            if (!email) {
                errors.email = 'Email is required';
            }
        } else if (formType === 'resetPassword') {
            if (!password) {
                errors.password = 'Password is required';
            }
            if (password !== confirmPassword) {
                errors.confirmPassword = 'Passwords do not match';
                errors.password = 'Passwords do not match';
            }
            if (!otp) {
                errors.otp = 'OTP is required';
            }
        }
        if (Object.keys(errors).length > 0) {
            dispatch(adminLoginFail(errors));
            toast.error('Validation Error');
            return;
        }

        if (formType === 'login') {
            adminLogin(email, password)
                .then(res => {
                    toast.success(res.msg);
                    const authToken = res.data.token.split(' ')[1];
                    localStorage.setItem('auth_token', authToken);
                    const user = decodeJWT(authToken);
                    setAuthorizationHeader(authToken);
                    if (user.allow_password_change) {
                        handleFormType('updatePassword');
                        dispatch(adminUpdatePassword(user));
                    } else {
                        dispatch(adminLoginSuccess(user));
                        navigate('/admin');
                    }
                })
                .catch(err => {
                    if (err?.response?.data?.err) {
                        toast.error(err.response.data.msg);
                        dispatch(adminLoginFail(err.response.data.err));
                    } else {
                        console.error(err);
                    }
                })
        } else if (formType === 'updatePassword') {
            updateAdminPassword(password)
                .then(res => {
                    toast.success(res.msg);
                    const authToken = res.data.token.split(' ')[1];
                    localStorage.setItem('auth_token', authToken);
                    const user = decodeJWT(authToken);
                    setAuthorizationHeader(authToken);
                    dispatch(adminLoginSuccess(user));
                    navigate('/admin');
                })
                .catch(err => {
                    if (err?.response?.data?.err) {
                        toast.error(err.response.data.msg);
                        dispatch(adminLoginFail(err.response.data.err));
                    } else {
                        console.error(err);
                    }
                });
        } else if (formType === 'forgotPassword') {
            forgotAdminPassword(email)
                .then(res => {
                    toast.success(res.msg);
                    setHash(res.data.hash);
                    handleFormType('resetPassword');
                    dispatch(adminUpdatePassword(null));
                })
                .catch(err => {
                    if (err?.response?.data?.err) {
                        toast.error(err.response.data.msg);
                        dispatch(adminLoginFail(err.response.data.err));
                    } else {
                        console.error(err);
                    }
                });
        } else if (formType === 'resetPassword') {
            resetAdminPassword(email, password, hash, otp)
                .then(res => {
                    toast.success(res.msg);
                    const authToken = res.data.token.split(' ')[1];
                    localStorage.setItem('auth_token', authToken);
                    const user = decodeJWT(authToken);
                    setAuthorizationHeader(authToken);
                    dispatch(adminLoginSuccess(user));
                })
                .catch(err => {
                    if (err?.response?.data?.err) {
                        toast.error(err.response.data.msg);
                        dispatch(adminLoginFail(err.response.data.err));
                    } else {
                        console.error(err);
                    }
                });
        }
    }

    const handleFormType = (name) => {
        setConfirmPassword('');
        setPassword('');
        dispatch(adminClearErrors({}));
        setFormType(name);
    }

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
        document.title = 'Admin Login | CSM';
    }, []);

    useEffect(() => {
        console.log(isAuthenticated, adminUser?.allow_password_change)
        if (!isAuthenticated && adminUser?.allow_password_change) {
            handleFormType('updatePassword');
        }
    }, [isAuthenticated, adminUser?.allow_password_change]);

    useEffect(() => {
        const role = AuthenticateFromLocalStorage();
        if (role && (role === 'super_admin' || role === 'admin')) {
            navigate('/admin');
        }
    }, [isAuthenticated, navigate])

    return (
        <section className="login">
            <div className="login__img-container"></div>
            <div className="login__form-container">
                <p className="login__form-container__title">
                    Rajam's <span className="text-secondary">#1</span> Grocery Delivery App
                </p>
                <InlineText content='Login or Signup' />

                <form className='login__form-container__form' onSubmit={handleSubmit}>
                    {/* login           :: email,   password                                */}
                    {/* updatePassword  ::          password,   confirm password            */}
                    {/* forgotPassword  :: email                                            */}
                    {/* otp             :: email,                                   otp     */}
                    {/* resetPassword   ::          password,   confirm password,   otp     */}

                    {formType !== 'resetPassword' && formType !== 'updatePassword' && (
                        <Input
                            type='email'
                            name="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            loading={formType === 'otp' ? true : loading}
                            error={errors?.email}
                        />
                    )}

                    {formType !== 'otp' && formType !== 'forgotPassword' && (
                        <Input
                            type='password'
                            name='password'
                            placeholder='Password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            loading={loading}
                            error={errors?.password}
                        />
                    )}

                    {(formType === 'resetPassword' || formType === 'updatePassword') && (
                        <Input
                            type='password'
                            name='confirm-password'
                            placeholder='Confirm Password'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            loading={loading}
                            error={errors?.confirmPassword}
                        />
                    )}

                    {(formType === 'otp' || formType === 'resetPassword') && (
                        <Input
                            type='number'
                            name='otp'
                            placeholder='Enter OTP'
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            loading={loading}
                            error={errors?.otp}
                        />
                    )}

                    <div className='form-group'>
                        <button type='submit' className={`btn btn--primary btn--block ${loading && 'btn--loading'}`}>
                            {/* for login: Login */}
                            {/* for updatePassword: Update */}
                            {/* for forgotPassword: Send OTP */}
                            {/* for otp and resetPassword: Submit */}
                            {loading ? 'Please Wait...' : formType === 'login' ? 'Login' : formType === 'updatePassword' ? 'Update' : formType === 'forgotPassword' ? 'Send OTP' : 'Submit'}
                        </button>
                    </div>
                    <div className="login__form-container__form__register">
                        {formType === 'login' ? (
                            <p onClick={() => handleFormType('forgotPassword')}>forgot password</p>
                        ) : formType === 'register' || formType === 'forgotPassword' ? (
                            <p onClick={() => handleFormType('login')}>already registered? login here...</p>
                        ) : (
                            ''
                        )}
                    </div>
                </form>

                <InlineText content='or' />

                <div className="login__form-container__other">
                    <button className="btn btn--outlined btn--outlined-inactive btn--round" onClick={() => alert('Ruko Jara! Sabar Karo...')}>
                        <i className="fab fa-google"></i>
                    </button>
                    <button className='btn btn--outlined btn--outlined-inactive btn--round'>
                        <i className="fa-solid fa-ellipsis"></i>
                    </button>
                </div>

                {formType === 'updatePassword' && (
                    <div className="login__form-container__privacy-policy">
                        <p className='login__form-container__privacy-policy__content'>
                            By continuing, you agree to City Super Market's
                            <a href='https://www.zomato.com/privacy'> Terms of Use</a> and
                            <a href='https://www.zomato.com/privacy'> Privacy Policy</a>
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default AdminLogin;