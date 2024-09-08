import React, { useEffect, useState } from 'react';
// import { validateProductForm } from '../../Validators/admin';
import ProductForm from '../../components/ProductForm';
import { addProduct } from '../../api/product';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
    const initialData = {
        "productId": "",
        "brand": "",
        "name": "",
        "image": "false",
        "category": "false",
        "subCategory": "false",
        "quantityType": "false",
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

    const addProductHandler = () => {
        console.log("something");
    }

    return (
        <div>
            <ProductForm type="Add" data={{}} onSubmit={addProductHandler}/>
        </div>
    );
};

export default AddProduct;