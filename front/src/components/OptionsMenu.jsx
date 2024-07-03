import React, {useRef, useEffect} from 'react';
import PropTypes from 'prop-types';
import './OptionsMenu.css';

function OptionsMenu({isVisible, options, onClose, top, left}) {
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    if (!isVisible) return null;

    return (
        <div ref={menuRef} className="options-menu" style={{top, left}}>
            {options.map((option, index) => (
                <div key={index} className="options-menu-item" onClick={option.onClick}>
                    {option.label}
                </div>
            ))}
        </div>
    );
}

OptionsMenu.propTypes = {
    isVisible: PropTypes.bool.isRequired,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            onClick: PropTypes.func.isRequired,
        })
    ).isRequired,
    onClose: PropTypes.func.isRequired,
};

export default OptionsMenu;
