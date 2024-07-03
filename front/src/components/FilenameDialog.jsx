import React, { useEffect, useRef, useState } from 'react';
import './FilenameDialog.css';

const FilenameDialog = (props) => {
    const [filename, setFilename] = useState('');
    const filenameDialogRef = useRef(null);

    const handleInputChange = (event) => {
        setFilename(event.target.value);
    };

    const handleSubmit = () => {
        props.onSubmitFilename(filename);
    };

    const handleClickOutside = (event) => {
        if (filenameDialogRef.current && !filenameDialogRef.current.contains(event.target)) {
            props.onSubmitFilename(null);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="filename-dialog-overlay">
            <div className="filename-dialog-content" ref={filenameDialogRef}>
                <input
                    type="text"
                    placeholder="Enter filename..."
                    value={filename}
                    onChange={handleInputChange}
                />
                <button onClick={handleSubmit}>Submit</button>
            </div>
        </div>
    );
}

export default FilenameDialog;