import React, { useState } from 'react';

const Form = ({ type, data, fields = [], fieldNames = [], fieldTypes = [], onSubmit, className, fieldErrors = {} }) => {
    const [formData, setFormData] = useState(data);

    const handleChange = (e, fieldName) => {
        setFormData({ ...formData, [fieldName]: e.target.value });
    };

    const handleSubmit = (e) => {
        console.log("submitting the form", formData);
        e.preventDefault();
        onSubmit(formData);
    };

    if((fields.length !== fieldNames.length) || (fields.length !== fieldTypes.length))
        {
            throw new Error("Length of fieldNames and fieldTypes must match with length of fields");
        }

    return (
        <div className='BaseForm'>
            <div className="FormContainer">
                <form onSubmit={handleSubmit} className={className}>
                    {fields.map((field, index) => (
                        <div className="FormField" key={index}>
                            <label htmlFor={field} className="FieldLabel">{fieldNames[index]}</label>
                            {(fieldTypes[index]["type"] === 'text' || fieldTypes[index]["type"] === 'password' ) && (
                                <input type={fieldTypes[index]["type"]} id={field} name={field} value={formData[field] || ''} onChange={(e) => handleChange(e, field)} className="FieldInput" />
                            )}
                            {fieldTypes[index]["type"] === 'select' && (
                                <select id={field} name={field} value={formData[field] || ''} onChange={(e) => handleChange(e, field)} className="FieldInput">
                                    <option value="" selected></option>
                                    {fieldTypes[index]["values"].map((obj) => {
                                        key = Object.keys(obj)[0];
                                        value = Object.values(obj)[0];
                                        return <option value={key} selected={value === formData[field]}>{value}</option>
                                    })}
                                </select>
                            )}
                            {fieldErrors[field] && <div className='field-error-div'><p className='err-msg'>{fieldErrors[field]}</p></div>}
                        </div>
                    ))}
                    <button className="btn btn-submit" type="submit">{type}</button>
                </form>
            </div>
        </div>
    );
};

export default Form;
