import axios from "axios";

export const getCategories = () => new Promise((resolve, reject) => {
    axios.get('/categories')
        .then(res => resolve(res.data))
        .catch(err => reject(err));
});