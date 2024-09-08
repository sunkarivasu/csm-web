import React,{useEffect, useState} from 'react';
import './AdminDashboard.css';
import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RiAdminFill } from "react-icons/ri";
import { FaShoppingCart, FaBoxOpen } from "react-icons/fa";
import { BiCategory } from "react-icons/bi";
import { BiSolidOffer } from "react-icons/bi";
import { MdLocalOffer } from "react-icons/md";
import { FaUserTag } from "react-icons/fa";
import { FaCodePullRequest } from "react-icons/fa6";

const AdminDashboard = () => {
    const admin = useSelector(state => state.admin);
    const [selectedIcon, setSelectecIcon] = useState("admins");
    useEffect(() => {
        console.log('admin:', admin);
    },[])

    const handleChangeOption = (option) => {
        setSelectecIcon(option)
    }

    return (
        <div className='dashboardContainer'>
            <div className="left">
                <div className='brand-name'>CSM</div>
                <div className='dashboard-menu'>
                    {admin.user.role === 'super_admin' && (
                    <Link to='/admin/admins' onClick={() => handleChangeOption("admins")}>
                        <div className={`pill ${selectedIcon === "admins"?"icon-selected":""}`}>
                            <RiAdminFill className='icon'/>
                        </div>
                    </Link>
                    )}
                    <Link to='/admin/orders'  onClick={() => handleChangeOption("orders")}>
                        <div className={`pill ${selectedIcon === "orders"?"icon-selected":""}`}>
                            <FaShoppingCart className="icon"/>
                        </div>
                    </Link>
                    <Link to='/admin/products' onClick={() => handleChangeOption("products")}>
                        <div className={`pill ${selectedIcon === "products"?"icon-selected":""}`}>
                            <FaBoxOpen className="icon"/>
                        </div>
                    </Link>
                    <Link to='/admin/categories' onClick={() => handleChangeOption("categories")}>
                        <div className={`pill ${selectedIcon === "categories"?"icon-selected":""}`}>
                            <BiCategory className="icon"/>
                        </div>
                    </Link>
                    <Link to='/admin/offers' onClick={() => handleChangeOption("offers")}>
                        <div className={`pill ${selectedIcon === "offers"?"icon-selected":""}`}>
                            <BiSolidOffer className='icon'/>
                        </div>
                    </Link>
                    <Link to='/admin/normal-offers' onClick={() => handleChangeOption("normal-offers")}>
                        <div className={`pill ${selectedIcon === "normal-offers"?"icon-selected":""}`}>
                            <MdLocalOffer className='icon'/>
                        </div>
                    </Link>
                    <Link to='/admin/offer-users' onClick={() => handleChangeOption("offer-users")}>
                        <div className={`pill ${selectedIcon === "offer-users"?"icon-selected":""}`}>
                            <FaUserTag className='icon'/>
                        </div>
                    </Link>
                    <Link to='/admin/requests' onClick={() => handleChangeOption("requests")}>
                        <div className={`pill ${selectedIcon === "requests"?"icon-selected":""}`}>
                            <FaCodePullRequest className='icon'/>
                        </div>
                    </Link>
                </div>
            </div>
            <div className="right"><Outlet /></div>
        </div>
    );
};

export default AdminDashboard;