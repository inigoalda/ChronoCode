import React from 'react';
import PropTypes from 'prop-types';
import './IconItem.css';

function IconItem({icon: Icon, height, fontSize, onClick, isActive}) {
    return (<div
        className={`icon-item ${isActive ? 'active' : ''}`}
        style={{height}}
        onClick={onClick}
    >
        <div className="icon" style={{fontSize}}>
            <Icon/>
        </div>
    </div>);
}

IconItem.propTypes = {
    icon: PropTypes.elementType.isRequired,
    height: PropTypes.string,
    fontSize: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    isActive: PropTypes.bool
};

IconItem.defaultProps = {
    height: '50px', fontSize: '1.5rem',
};

export default IconItem;
