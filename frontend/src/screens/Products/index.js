import React, { useEffect, useState } from 'react';
import { getProducts } from '../../api/product';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import "./products.css";

const Products = () => {
    const [products, setProducts] = useState([]);
    const [listOfProductsToShow, setProductsToShow] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        getProducts()
            .then(res => {
                console.log('data', res.data);
                setProducts(res.data.products)
            })
            .catch(err => {
                if (err?.response?.data?.err) {
                    toast.error(err.response.data.msg);
                } else {
                    console.error(err);
                }
            });
    }, []);

    const handleAddProduct = () => {
        navigate("add")
    }

    return <div className="card">
                <div className="table-name">Products</div>
                <div className='add-btn-div'>
                    <button className='add-btn' onClick={handleAddProduct}>Add</button>
                </div>
                <div className="products-table striped">
                    <div>
                        <div className='row table-heading table-row'>
                            <div className='col-md-1 product-header table-heading-column'>Image</div>
                            <div className='col-md-1 product-header table-heading-column'>ID</div>
                            <div className='col-md-2 product-header table-heading-column'>Category</div>
                            <div className='col-md-2 product-header table-heading-column'>SubCategory</div>
                            <div className='col-md-1 product-header table-heading-column'>Name</div>
                            <div className='col-md-1 product-header table-heading-column'>Brand</div>
                            <div className='col-md-3 product-header table-heading-column'>Description</div>
                            <div className='col-md-1 product-header table-heading-column'>Quantity</div>
                        </div>
                    </div>
                    {products.map((product, index) => {
                        return (
                            <div className='table-data-row'>
                                <div className={`row table-row ${index%2 != 0 && 'even-table-row'}`} onClick={() => {
                                    let newListOfProductsToShow = [...listOfProductsToShow]
                                    let currentIndex = newListOfProductsToShow.indexOf(index)
                                    if(currentIndex > -1){
                                        delete newListOfProductsToShow[currentIndex]
                                    }
                                    else{
                                        newListOfProductsToShow.push(index)
                                    }
                                    setProductsToShow(newListOfProductsToShow)
                                }}>
                                    <div className='col-md-1 product-img-div'><img className='product-img' src={product["image"]}></img></div>
                                    <div className='col-md-1'>{product["id"]}</div>
                                    <div className='col-md-2'>{product["category"]["name"]}</div>
                                    <div className='col-md-2'>{product["subCategory"]["name"]}</div>
                                    <div className='col-md-1'>{product['name']}</div>
                                    <div className='col-md-1'>{product['brand']}</div>
                                    <div className='col-md-3'>{product['descriptoin']}</div>
                                    <div className='col-md-1'>{product['quantityType']}</div>
                                </div>
                                { listOfProductsToShow.indexOf(index) > -1 &&
                                    <div>
                                        <div className='row sub-table-heading sub-table-row'>
                                            <div className='col-md-1'>Quantity</div>
                                            <div className='col-md-1 '>M.R.P</div>
                                            <div className='col-md-1'>Discount</div>
                                            <div className='col-md-2'>Discount Type</div>
                                            <div className='col-md-2'>Is Featured</div>
                                            <div className='col-md-2'>Is Available</div>
                                            <div className='col-md-1'>Is Active</div>
                                        </div>
                                        <div>
                                            {
                                                product["variants"].map((variant, indx) => {
                                                return <div key={indx} className={`row sub-table-row ${indx%2 != 0 && 'even-sub-table-row'}`}>
                                                    <div className='col-md-1'>{variant["quantity"]}</div>
                                                    <div className='col-md-1'>RS {variant["price"]}</div>
                                                    <div className='col-md-1'>{variant["discount"]}</div>
                                                    <div className='col-md-2'>{variant["discountType"]}</div>
                                                    <div className='col-md-2'>{variant["available"]? "Yes":"No"}</div>
                                                    <div className='col-md-2'>{variant["isFeatured"]? "Yes":"No"}</div>
                                                    <div className='col-md-1'>{variant["isActive"]? "Yes":"No"}</div>
                                                </div>
                                                })
                                            }
                                        </div>
                                    </div>
                                }
                            </div>
                            )
                    })}
                </div>
            </div>
};

export default Products;