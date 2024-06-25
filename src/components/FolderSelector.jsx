import React, { useEffect, useRef, useState } from 'react';
import './FolderSelector.css';

const FolderSelector = ({ onSubmitFolder }) => {
    const [filename, setFilename] = useState('');
    const fileSelectorRef = useRef(null);

    const handleInputChange = (event) => {
        setFilename(event.target.value);
    };

    const handleSubmit = () => {
        onSubmitFolder(filename);
    };

    const handleClickOutside = (event) => {
        if (fileSelectorRef.current && !fileSelectorRef.current.contains(event.target)) {
            onSubmitFolder(null);
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
                <input 
                    type="text" 
                    placeholder="Enter folder path..." 
                    value={filename} 
                    onChange={handleInputChange} 
                />
                <button onClick={handleSubmit}>Submit</button>
            </div>
        </div>
    );
};

export default FolderSelector;
