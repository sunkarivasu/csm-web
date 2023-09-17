import React from 'react';
import PropTypes from 'prop-types';
import './InlineText.css';


const InlineText = ({ content, style }) => {
    return (
        <div className='inline-text'>
            <div className='inline-text__line'></div>
            <div style={{ margin: '0 20px' }}>
                <p className='inline-text__content' style={style}>{content}</p>
            </div>
            <div className='inline-text__line'></div>
        </div>
    );
};

InlineText.defaultProps = {
    style: {}
};

InlineText.propTypes = {
    content: PropTypes.string.isRequired,
    style: PropTypes.object
};

export default InlineText;