import React, { useEffect, useState } from 'react';
import { validateAdminForm } from '../../Validators/admin';
import Form from '../../components/Form';
import { registerAdmin } from '../../api/admin';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AddAdmin = () => {
    const initialData = {
        "name": "",
        "email": "",
        "password": "",
        "allow_password_change": "false",
    };

    const initialErrors = {
        // "name": "",
        // "email": "",
        // "password": "",
        // "allow_password_change": "",
    }
    const [adminForm, setAdminForm] = useState(initialData);
    const [adminFormErrors, setAdminFormErrors] = useState(initialErrors);
    const navigate = useNavigate();


    useEffect(() => {
    }, []);

    const onSubmit = (newAdmin) => {
        const validationResult = validateAdminForm(newAdmin);
        const isValid = validationResult[0]
        const validationErrors = validationResult[1]
        if (isValid){
            registerAdmin(newAdmin)
            .then((res) => {
                toast.success(res.msg);
                navigate("/admin/admins");
            })
            .catch((err) => {
                if (err?.response?.data?.err) {
                    toast.error(err.response.data.msg);
                } else {
                    console.error(err);
                }
            })
        }
        else{
            setAdminFormErrors({...validationErrors})
        }

    }

    return (
        <div>
            <section>
                <Form
                    data={adminForm}
                    name="Add Admin"
                    type="Add"
                    fields={['name', 'email', 'password', 'allow_password_change']}
                    fieldErrors = {adminFormErrors}
                    fieldNames={['Name', 'Email', 'Password', 'Allow Password Change']}
                    fieldTypes={[{type:'text', values:[]}, { type :'text', values: []}, { type :'password', values: []}, {type: 'select', values: [{'true':'True'}, {'false':'False'}]}]}
                    className='striped'
                    onSubmit={onSubmit}
                />
            </section>
        </div>
    );
};

export default AddAdmin;