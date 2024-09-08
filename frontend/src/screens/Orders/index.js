import React,{useState,useEffect} from 'react';
import { getOrders, cancelOrder, confirmOrder, deliverOrder } from '../../api/order';
import {formatDate} from '../../utils/date';
import { toast } from 'react-toastify';
import './Orders.css';



const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [listOfOrdersToShow, setOrdersToShow] = useState([]);
    const [ordersToUpdate, setOrdersToUpdate] = useState({});

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = () =>
    {
        getOrders()
            .then(res => {
                console.log('data', res.data.orders);
                setOrders(res.data.orders)
            })
            .catch(err => {
                if (err?.response?.data?.err) {
                    toast.error(err.response.data.msg);
                } else {
                    console.error(err);
                }
            });
    }

    const handleCancelOrder = (orderId) => {
        cancelOrder(orderId)
        .then(res => {
            toast.success(res.msg);
        })
        .catch(err => {
            if (err?.response?.data?.err) {
                toast.error(err.response.data.msg);
            } else {
                console.error(err);
            }
        })
        .then(() => fetchOrders())

    }

    const handleConfirmOrder = (orderId) => {
        confirmOrder(orderId, ordersToUpdate[orderId])
        .then(res => {
            toast.success(res.msg);
        })
        .catch(err => {
            if (err?.response?.data?.err) {
                toast.error(err.response.data.msg);
            } else {
                console.error(err);
            }
        })
        .then(() => fetchOrders())
    }

    const handleDeliverOrder = (orderId) => {
        deliverOrder(orderId, ordersToUpdate[orderId])
        .then(res => {
            toast.success(res.msg);
        })
        .catch(err => {
            if (err?.response?.data?.err) {
                toast.error(err.response.data.msg);
            } else {
                console.error(err);
            }
        })
        .then(() => fetchOrders())
    }


    const handleOrderQuanityChange = (e) => {
        const orderDetails = e.target.id.split('-')
        const orderId = orderDetails[0]
        const productId = orderDetails[1]
        currentOrderItemIndex = ordersToUpdate[orderId].findIndex(orderItem => orderItem["productId"] == productId)
        let currentOrder = ordersToUpdate[orderId]
        currentOrder.splice(currentOrderItemIndex, 1)
        console.log("key", e.target.name)
        currentOrder.push({
            "productId": productId,
            "orderQuantity": +e.target.value,
            "quantity": +e.target.name
        })
        setOrdersToUpdate({...ordersToUpdate, [orderId]: currentOrder})
    }

    return (
        <div>
                {/* <Table
                    data={[...orders]}
                    name="Orders"
                    headersNew={[
                        { name: 'id', type: 'text', show: false },
                        { name: 'name', displayName: 'Name', type: 'text', show: true },
                        { name: 'email', type: 'text', show: true },
                        { name: 'role', type: 'button', show: true, handler: () => { } },
                        { name: 'allow_password_change', displayName: 'Password Change', type: 'boolean', show: true, alterText: { true: 'Allowed', false: 'Not Allowed' } },
                        { name: 'createdAt', type: 'date', show: true }

                    ]}
                    headers={['name', 'contactNumber', 'address', 'numberOfItems', 'amount',]}
                    headerNames={['Name', 'Contact Number', 'Address', 'Items count', 'Amount']}
                    id={false}
                    className='striped'
                    actions={[
                        {
                            name: 'Edit',
                            handler: (id) => {
                                console.log(id);
                            }
                        },
                    ]}
                /> */}
                    <div className="card">
                        <div className="table-name">Orders</div>
                        <div className="orders-table striped">
                            <div>
                                <div className='row table-heading table-row'>
                                    <div className='col-md-2 order-header table-heading-column'>Name</div>
                                    <div className='col-md-2 order-header table-heading-column'>Contact Number</div>
                                    <div className='col-md-3 order-header table-heading-column'>Address</div>
                                    <div className='col-md-1 order-header table-heading-column'>No: Items</div>
                                    <div className='col-md-1 order-header table-heading-column'>Amount</div>
                                    <div className='col-md-2 order-header table-heading-column'>Status</div>
                                </div>
                            </div>
                            {orders.map((order, index) => {
                                return (
                                    <div className='table-data-row'>
                                        <div className={`row table-row ${index%2 != 0 && 'even-table-row'}`} onClick={() => {
                                            let newListOfOrdersToShow = [...listOfOrdersToShow]
                                            let currentIndex = newListOfOrdersToShow.indexOf(index)
                                            if(currentIndex > -1){
                                                delete newListOfOrdersToShow[currentIndex]
                                            }
                                            else{
                                                newListOfOrdersToShow.push(index)
                                            }
                                            setOrdersToShow(newListOfOrdersToShow)
                                            if(!ordersToUpdate[order["id"]]){
                                                let newOrderProductToUpdate = [];
                                                for(let orderItem of order["orderItems"]){
                                                    newOrderProductToUpdate.push(
                                                        {
                                                            "productId": orderItem["id"],
                                                            "orderQuantity": orderItem["orderQuantity"],
                                                            "quantity": orderItem["quantity"],
                                                        })
                                                console.log("orderItem", orderItem)
                                                console.log("order", order)
                                                console.log("orderItems", order["orderItems"])
                                                }
                                                console.log("newOrderProductToUpdate", newOrderProductToUpdate)
                                                setOrdersToUpdate({...ordersToUpdate, [order["id"]]: newOrderProductToUpdate});
                                            }
                                        }}>
                                            <div className='col-md-2'>{order["name"]}</div>
                                            <div className='col-md-2'>{order["contactNumber"]}</div>
                                            <div className='col-md-3'>{order['address']}</div>
                                            <div className='col-md-1'>{order['numberOfItems']}</div>
                                            <div className='col-md-1'>RS {order['amount']}</div>
                                            <div className='col-md-2'>
                                                {getOrderStatusBar(order['history'], index)}
                                            </div>
                                        </div>
                                        { listOfOrdersToShow.indexOf(index) > -1 &&
                                            <div>
                                                <div className='row sub-table-heading sub-table-row'>
                                                    <div className='col-md-2'>Image</div>
                                                    <div className='col-md-2 '>Name</div>
                                                    <div className='col-md-2'>Quantity</div>
                                                    <div className='col-md-2 '>M.R.P</div>
                                                    <div className='col-md-2'>Price</div>
                                                    <div className='col-md-2'>Order Quantity</div>
                                                </div>
                                                <div>
                                                    {
                                                        order["orderItems"].map((orderItem, indx) => {
                                                        console.log("orderItem", orderItem);
                                                        console.log("ordersToUpdate", ordersToUpdate)
                                                        console.log("ordersToUpdate", order)
                                                        console.log("ordersToUpdate", ordersToUpdate[order["id"]])
                                                        const indexOfCurrentOrderItem = ordersToUpdate[order["id"]].indexOf(p => p["productId"] == orderItem["id"])
                                                        console.log("indexOfCurrentOrderItem", indexOfCurrentOrderItem)
                                                        console.log("ordersToUpdate", ordersToUpdate)
                                                        return <div key={indx} className={`row sub-table-row ${indx%2 != 0 && 'even-sub-table-row'}`}>
                                                            <div className='col-md-2 product-image'><img src={orderItem["image"]}></img></div>
                                                            <div className='col-md-2'>{orderItem["productName"]}</div>
                                                            <div className='col-md-2'>{orderItem["quantity"]}</div>
                                                            <div className='col-md-2'>RS {orderItem["price"]}</div>
                                                            <div className='col-md-2'>RS {orderItem["priceAfterDiscount"]}</div>
                                                            <div className='col-md-2 order-quantity-div'>
                                                            <input type='number' className="order-quantity-input" name={orderItem["quantity"]} id={`${order["id"]}-${orderItem["id"]}`} value = {ordersToUpdate[order["id"]].find(p => p["productId"] === orderItem["id"])["orderQuantity"]} onChange={handleOrderQuanityChange}/></div>
                                                        </div>
                                                        })
                                                    }
                                                </div>
                                                <div className='order-action-btns-div'>
                                                    <button className='order-action-btn confirm' onClick={() => {handleConfirmOrder(order["id"])}}>Confirm</button>
                                                    <button className='order-action-btn cancel' onClick={() => {handleCancelOrder(order["id"])}}>Cancel</button>
                                                    <button className='order-action-btn delivered' onClick={() => {handleDeliverOrder(order["id"])}}>Delivered</button>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                    )
                            })}
                        </div>
                    </div>
                </div>
    );

};

const getOrderStatusBar = (orderHistory, orderNumber) => {
    console.log("orderHistory", orderHistory);
    if(orderHistory.length > 3){
        orderHistory = orderHistory.slice(orderHistory.length -3, orderHistory.length);
    }
    console.log(orderHistory);

    return <div className='order-status-div'>
        {orderHistory.map((orderStatus, index) => {
                return <div key={index}>
                        <div className={`order-status ${orderStatus['status'].toLowerCase()}`}
                        onMouseOver={() => {
                            console.log("mouse over order status")
                            document.getElementsByClassName(`order-actual-status-${orderNumber}-${index}`)[0].classList.remove('hide')
                            document.getElementsByClassName(`order-actual-status-${orderNumber}-${index}`)[0].classList.add('show')
                        }}
                        onMouseLeave={() => {
                            console.log("mouse down the order status")
                            document.getElementsByClassName(`order-actual-status-${orderNumber}-${index}`)[0].classList.remove('show')
                            document.getElementsByClassName(`order-actual-status-${orderNumber}-${index}`)[0].classList.add('hide')
                        }}
                        >
                        <div className="order-status-symbol-div">
                            <div className='order-status-circle-icon'>o</div>
                            <div className='order-status-symbol'>{orderStatus['status'][0]}</div>
                        </div>  { index != orderHistory.length -1 && <div className='order-status-horizontal-line'> </div>} </div>
                        <div className={`order-actual-status-${orderNumber}-${index} hide`}>
                            <div>{orderStatus['status']}</div>
                            <div>{formatDate(orderStatus['date'])}</div>
                        </div>
                    </div>
        })}
    </div>
}

export default Orders;