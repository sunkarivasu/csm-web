import React, { useEffect, useState } from 'react';
import Table from '../../components/Table';
import { getAdmins, deleteAdmin } from '../../api/admin';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Admins = () => {
    const [admins, setAdmins] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        getAdmins()
            .then(res => {
                console.log('data', res.data);
                setAdmins(res.data.admins)
            })
            .catch(err => {
                if (err?.response?.data?.err) {
                    toast.error(err.response.data.msg);
                } else {
                    console.error(err);
                }
            });
    }, []);

    const deleteAdminHandler = (id) => {
        deleteAdmin(id)
        .then(() => toast.success('Admin Deleted Successfully'))
        .catch(err => {
            toast.error(err)
        });
    }

    return (
        <div>
            <section>
                <Table
                    data={[...admins]}
                    name="Admins"
                    headers={['name', 'email', 'allow_password_change']}
                    headerNames={['Name', 'Email', 'Allow Password Change']}
                    id={false}
                    hasAddNewButton={true}
                    className='striped'
                    actions={[
                        {
                            name: 'Delete',
                            handler: deleteAdminHandler
                        }
                    ]}
                />
            </section>
        </div>
    );
};

export default Admins;