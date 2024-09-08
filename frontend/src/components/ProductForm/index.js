import React, { useEffect, useState } from 'react';
import { getCategories } from '../../api/category';
import { toast } from 'react-toastify';
import { getSubCategoriesByCategoryName } from '../../api/sub_categories';
import "./index.css";

const ProductForm = ({ type, data, onSubmit}) => {
    const initialProductData = {
        "productId":"",
        "name":"",
        "brand":"",
        "description":"",
        "image":"https://media.istockphoto.com/id/486786315/photo/sprite.jpg?s=612x612&w=0&k=20&c=3Ao6R8oM4kLYFYNQ_h_GII04mfANMTLS7k7ByJyI5MY=",
        "category":"",
        "subCategory":"",
        "quantityType":"",
        "variants":[]
    }

    const quantityTypes = ["ml","gm", "unit"]

    const [productFormData, setProductFormData] = useState(Object.keys(data).length > 0 ? data : initialProductData);
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);

    const handleChange = (e) => {
        setProductFormData({ ...productFormData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        console.log("submitting the form", formData);
        e.preventDefault();
        onSubmit(formData);
    };

    useEffect(() => {
        console.log("product form data:", productFormData);
        getCategories()
            .then(res => {
                console.log('data', res.data);
                setCategories(res.data.categories)
            })
            .catch(err => {
                if (err?.response?.data?.err) {
                    toast.error(err.response.data.msg);
                } else {
                    console.error(err);
                }
            });
    }, []);

    useEffect(() => {
        if(productFormData.category){
            getSubCategoriesByCategoryName(productFormData.category)
            .then(res => {
                console.log('data', res.data);
                setSubCategories(res.data.sub_categories)
            })
            .catch(err => {
                if (err?.response?.data?.err) {
                    toast.error(err.response.data.msg);
                } else {
                    console.error(err);
                }
            });
        }
        else{
            setSubCategories([])
        }
    },[productFormData.category])

    return (
        <div className='BaseForm'>
            <div className="FormContainer product-form">
                <form onSubmit={handleSubmit} className="product-form">
                        <div className='category-fields'>
                            <div className="FormField category-select-field">
                                <div>
                                    <label htmlFor="category" className="FieldLabel">Category</label>
                                    <select id="category" name="category" value={productFormData["category"]} onChange={handleChange} className="FieldInput">
                                        <option value=""></option>
                                        {categories.map((category, index) => <option key={index} value={category["name"]} selected={productFormData["category"] === category["name"]}>{category["name"]}</option>)}
                                    </select>
                                </div>
                                {/* {fieldErrors[field] && <div className='field-error-div'><p className='err-msg'>{fieldErrors[field]}</p></div>} */}
                            </div>
                            <div className="FormField subCategory-select-field">
                                <div>
                                    <label htmlFor="subCategory" className="FieldLabel">Sub Category</label>
                                    <select id="subCategory" name="subCategory" value={productFormData["subCategory"]} onChange={handleChange} className="FieldInput">
                                        {subCategories.map((subCategory, index) => <option key={index} value={subCategory["name"]} selected={productFormData["category"] === subCategory["name"]}>{subCategory["name"]}</option>)}
                                    </select>
                                </div>
                                {/* {fieldErrors[field] && <div className='field-error-div'><p className='err-msg'>{fieldErrors[field]}</p></div>} */}
                            </div>
                        </div>
                        <div className='name-brand-fields'>
                            <div className="FormField">
                                <div>
                                    <label htmlFor="name" className="FieldLabel">Name</label>
                                    <input type="text" id="name" name="name" value={productFormData["name"]} onChange={(e) => handleChange(e)} className="FieldInput"></input>
                                </div>
                                {/* {fieldErrors[field] && <div className='field-error-div'><p className='err-msg'>{fieldErrors[field]}</p></div>} */}
                            </div>
                            <div className="FormField">
                                <div>
                                    <label htmlFor="brand" className="FieldLabel">Brand</label>
                                    <input type="text" id="brand" name="brand" value={productFormData["name"]} onChange={(e) => handleChange(e)} className="FieldInput"></input>
                                </div>
                                {/* {fieldErrors[field] && <div className='field-error-div'><p className='err-msg'>{fieldErrors[field]}</p></div>} */}
                            </div>
                        </div>
                        <div className="FormField">
                            <div>
                                <label htmlFor="description" className="FieldLabel">Description</label>
                                <textarea id="description" name="description" value={productFormData["description"]} onChange={(e) => handleChange(e)} className="FieldInput"></textarea>
                            </div>
                            {/* {fieldErrors[field] && <div className='field-error-div'><p className='err-msg'>{fieldErrors[field]}</p></div>} */}
                        </div>
                        <div className='quantityType-image-fields'>
                            <div className="FormField">
                                <div>
                                    <label htmlFor="image" className="FieldLabel">Image</label>
                                    <input type="file" id="image" name="image" onChange={(e) => handleChange(e)} className="FieldInput"></input>
                                    <div className='or-text'>OR</div>
                                    <input type="text" name="image" className='FieldInput' onChange={handleChange} placeholder='Paste the Image URL here'></input>
                                    {productFormData["image"] && <img className="product-image" src={productFormData["image"]}></img>}
                                </div>
                                {/* {fieldErrors[field] && <div className='field-error-div'><p className='err-msg'>{fieldErrors[field]}</p></div>} */}
                            </div>
                            <div className="FormField">
                                <div>
                                    <label htmlFor="quantityType" className="FieldLabel">Quantity Type</label>
                                    <select id="quantityType" name="quantityType" value={productFormData["quantityType"]} onChange={(e) => handleChange(e)} className="FieldInput">
                                        {quantityTypes.map((qt, index) => {
                                            return <option key={index} value={qt} selected={productFormData["quantityType"] == qt}>{qt}</option>
                                        })}
                                    </select>
                                </div>
                                {/* {fieldErrors[field] && <div className='field-error-div'><p className='err-msg'>{fieldErrors[field]}</p></div>} */}
                            </div>
                        </div>
                        <div className='variants-div'>
                                <div className='FormField'>
                                    <label className='FieldLabel'>Variants</label>
                                    <div className='variant-div row'>
                                        <div className='col-md-1'>
                                            <label className='FieldLabel'>Quantity</label>
                                            <input type="text" className='FieldInput' placeholder='Quantity'></input>
                                        </div>
                                        <div className='col-md-1'>
                                            <label className='FieldLabel'>M.R.P</label>
                                            <input type="text" className='FieldInput' placeholder='M.R.P'></input>
                                        </div>
                                        <div className='col-md-1'>
                                            <label className='FieldLabel'>Discount</label>
                                            <input type="number" className='FieldInput' placeholder='Discount'></input>
                                        </div>
                                        <div className='col-md-1'>
                                            <label className='FieldLabel'>Discount Type</label>
                                            <select className='FieldInput' placeholder='Discount Type'>
                                                {["Amount", "Percentage"].map((dt) => {
                                                    return <option value={dt} selected={true}>{dt}</option>
                                                })}
                                            </select>
                                        </div>
                                        <div className='col-md-1'>
                                            <label className='FieldLabel'>Is Featured</label>
                                            <select className='FieldInput' placeholder='Is Featured'>
                                                {["Yes", "No"].map((dt) => {
                                                    return <option value={dt} selected={true}>{dt}</option>
                                                })}
                                            </select>
                                        </div>
                                        <div className='col-md-1'>
                                            <label className='FieldLabel'>Is Active</label>
                                            <select className='FieldInput' placeholder='Is Active'>
                                                {["Yes", "No"].map((dt) => {
                                                    return <option value={dt} selected={true}>{dt}</option>
                                                })}
                                            </select>
                                        </div>
                                        <div className='col-md-1'>
                                            <label className='FieldLabel'>Is Available</label>
                                            <select className='FieldInput' placeholder='Is Available'>
                                                {["Yes", "No"].map((dt) => {
                                                    return <option value={dt} selected={true}>{dt}</option>
                                                })}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                    <button className="btn btn-submit" type="submit">{type}</button>
                </form>
            </div>
        </div>
    );
};

export default ProductForm;
