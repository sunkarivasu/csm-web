import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const Input = (params) => {
    const [inputType, setInputType] = useState(params.type);

    useEffect(() => {
        setInputType(params.type);
    }, [params.type]);

    return (
        <div className='form-group' style={{ position: 'relative' }}>
            <input
                type={inputType}
                name={params.name}
                className={`form-control ` + (params.error ? 'is-invalid' : '') + (params.className ? params.className : '')}
                placeholder={params.placeholder}
                value={params.value}
                onChange={params.onChange}
                disabled={params.loading}
                style={params.style}
            />
            {params.error && (<p className='error-feedback'>{params.error}</p>)}
            {params.type === 'password' && (
                <i
                    className={`fa-regular fa-eye` + (inputType === 'password' ? '-slash' : '')}
                    onClick={() => setInputType(inputType === 'password' ? 'text' : 'password')}
                ></i>
            )}
        </div>
    );
}

Input.defaultProps = {
    type: 'text',
    placeholder: '',
    loading: false,
    style: {},
};

Input.propTypes = {
    type: PropTypes.string,
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    error: PropTypes.string,
    style: PropTypes.object,
};

export default Input;