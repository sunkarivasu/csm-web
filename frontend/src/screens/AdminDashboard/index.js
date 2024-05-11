import React from 'react';
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

    return (
        <div className='container'>
            <div className="left">
                <div className='brand-name'>CSM</div>
                <div className='dashboard-menu'>
                    {aadmin.user.role === 'super_admin' && (
                    <Link to='/admin/admins'>
                        <div className='pill'>
                            <RiAdminFill className='icon'/>
                        </div>
                    </Link>
                    )}
                    <Link to='/admin/orders'>
                        <div className='pill'>
                            <FaShoppingCart className="icon"/>
                        </div>
                    </Link>
                    <Link to='/admin/products'>
                        <div className='pill icon-selected'>
                            <FaBoxOpen className="icon"/>
                        </div>
                    </Link>
                    <Link to='/admin/categories'>
                        <div className='pill'>
                            <BiCategory className="icon"/>
                        </div>
                    </Link>
                    <Link to='/admin/offers'>
                        <div className='pill'>
                            <BiSolidOffer className='icon'/>
                        </div>
                    </Link>
                    <Link to='/admin/normal-offers'>
                        <div className='pill'>
                            <MdLocalOffer className='icon'/>
                        </div>
                    </Link>
                    <Link to='/admin/offer-users'>
                        <div className='pill'>
                            <FaUserTag className='icon'/>
                        </div>
                    </Link>
                    <Link to='/admin/requests'>
                        <div className='pill'>
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