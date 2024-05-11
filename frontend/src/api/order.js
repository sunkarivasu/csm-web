import axios from "axios";

export const getOrders = () => new Promise((resolve, reject) => {
    axios.get("/orders")
    .then((res) => resolve(res.data))
    .catch((err) => reject(err));
});