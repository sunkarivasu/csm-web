import axios from 'axios';

export const setAxiosDefaults = () => {
    axios.defaults.baseURL = process.env.REACT_APP_API_URL;
    axios.interceptors.response.use(function (response) {
        return response;
    }, function (error) {
        if (!error.response) {
            error['response'] = {
                data: {
                    msg: error.message
                }
            }
        }
        return Promise.reject(error);
    });
};

export const setAuthorizationHeader = token => {
    if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    else delete axios.defaults.headers.common['Authorization'];
};