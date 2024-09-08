import axios from "axios";

export const getOrders = () => new Promise((resolve, reject) => {
    axios.get("/orders")
    .then((res) => resolve(res.data))
    .catch((err) => reject(err));
});

export const cancelOrder = (orderId) => new Promise((resolve, reject) => {
    axios.post("/orders/cancel-order", {orderId})
    .then((res) => resolve(res.data))
    .catch((err) => reject(err));
});
export const confirmOrder = (orderId, items) => new Promise((resolve, reject) => {
    axios.post("/orders/confirm-order", {orderId, items})
    .then((res) => resolve(res.data))
    .catch((err) => reject(err));
});

export const deliverOrder = (orderId) => new Promise((resolve, reject) => {
    axios.post("/orders/deliver-order", {orderId})
    .then((res) => resolve(res.data))
    .catch((err) => reject(err));
});