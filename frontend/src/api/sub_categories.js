import axios from "axios";

export const getSubCategoriesByCategoryName = (name) => new Promise((resolve, reject) => {
    axios.get(`sub-category/get-sub-categories-by-category-name/${name}`)
        .then(res => resolve(res.data))
        .catch(err => reject(err));
});