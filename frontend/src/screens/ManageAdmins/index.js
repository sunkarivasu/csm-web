import React, { useEffect, useState } from 'react';
import Table from '../../components/Table';
import { getAdmins } from '../../api/admin';

const ManageAdmins = () => {
    const [admins, setAdmins] = useState([]);

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
    return (
        <div>
            <section>
                <h1>Admins List</h1>
                <Table
                    data={[...admins]}
                    headersNew={[
                        { name: 'id', type: 'text', show: false },
                        { name: 'name', displayName: 'Name', type: 'text', show: true },
                        { name: 'email', type: 'text', show: true },
                        { name: 'role', type: 'button', show: true, handler: () => { } },
                        { name: 'allow_password_change', displayName: 'Password Change', type: 'boolean', show: true, alterText: { true: 'Allowed', false: 'Not Allowed' } },
                        { name: 'createdAt', type: 'date', show: true }

                    ]}
                    headers={['id', 'name', 'email', 'role', 'allow_password_change', 'createdAt']}
                    headerNames={['ID', 'Name', 'Email', 'Role', 'Allow Password Change', 'Created At']}
                    id={false}
                    className='striped'
                    actions={[
                        {
                            name: 'Edit',
                            handler: (id) => {
                                console.log(id);
                            }
                        },
                        {
                            name: 'Delete',
                            handler: (id) => {
                                console.log(id);
                            }
                        }
                    ]}
                />
            </section>
            <section>
                <h1>Add Admin</h1>
            </section>
        </div>
    );
};

export default ManageAdmins;