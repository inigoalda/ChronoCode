import React, { useEffect, useRef, useState } from 'react';
import './FileSelectorError.css';

const FileSelectorError = (props) => {
    const fileSelectorRef = useRef(null);

    const handleClickOutside = (event) => {
        if (fileSelectorRef.current && !fileSelectorRef.current.contains(event.target)) {
            props.onClose();
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="file-selector-overlay">
            <div className="file-selector-content" ref={fileSelectorRef}>
                <p>{props.message}</p>
                <button onClick={props.onClose}>Close</button>
            </div>
        </div>
    );
};

export default FileSelectorError;
