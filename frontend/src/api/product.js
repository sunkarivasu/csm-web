import axios from "axios"

export const getProducts = () => new Promise((resolve, reject) => {
    axios.get('/product')
        .then(res => resolve(res.data))
        .catch(err => reject(err));
});
export const addProduct = () => new Promise((resolve, reject) => {
    axios.post('/product/add', {})
        .then(res => resolve(res.data))
        .catch(err => reject(err));
});