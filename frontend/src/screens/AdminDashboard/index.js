import React from 'react';
import './AdminDashboard.css';
import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminDashboard = () => {
    const admin = useSelector(state => state.admin);

    return (
        <div className='container'>
            <div className="left">
                {admin.user.role === 'super_admin' && (
                    <Link to='/admin/manage-admins'>
                        <div className='pill'>
                            Manage Admins
                        </div>
                    </Link>
                )}
                <Link to='/admin/manage-categories'>
                    <div className='pill'>Manage Categories</div>
                </Link>
                <Link to='/admin/manage-subcategories'>
                    <div className='pill'>Manage Subcategories</div>
                </Link>
                <Link to='/admin/manage-products'>
                    <div className='pill'>Mange Products</div>
                </Link>
            </div>
            <div className="right"><Outlet /></div>
        </div>
    );
};

export default AdminDashboard;