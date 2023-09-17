import axios from 'axios';

export const adminLogin = (email, password) => new Promise((resolve, reject) => {
    axios.post('/admins/login', { email, password })
        .then(res => resolve(res.data))
        .catch(err => reject(err));
});

export const updateAdminPassword = password => new Promise((resolve, reject) => {
    axios.post('/admins/update-password', { password })
        .then(res => resolve(res.data))
        .catch(err => reject(err));
});

export const forgotAdminPassword = email => new Promise((resolve, reject) => {
    axios.post('/admins/forgot-password', { email })
        .then(res => resolve(res.data))
        .catch(err => reject(err));
});

export const resetAdminPassword = (email, password, otpHash, otp) => new Promise((resolve, reject) => {
    axios.post('/admins/reset-password', { email, password, otp_hash: otpHash, otp })
        .then(res => resolve(res.data))
        .catch(err => reject(err));
});

export const getAdmins = () => new Promise((resolve, reject) => {
    axios.get('/admins')
        .then(res => resolve(res.data))
        .catch(err => reject(err));
});