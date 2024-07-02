import React, { useState, useEffect, useRef } from 'react';
import './FileSelector.css';

const getParentPath = (path) => {
    const separatorIndex = path.lastIndexOf('/');
    return separatorIndex === -1 ? '/' : path.substring(0, separatorIndex + 1);
};

const SaveFileDialog = ({ onSubmitFile, onClose, currentFilePath }) => {
    const [currentPath, setCurrentPath] = useState(getParentPath(currentFilePath) || '/');
    const [inputPath, setInputPath] = useState('/');
    const [folders, setFolders] = useState([]);
    const [files, setFiles] = useState([]);
    const [history, setHistory] = useState([]);
    const [filename, setFilename] = useState('');
    const [error, setError] = useState(null);
    const fileSelectorRef = useRef(null);

    useEffect(() => {
        fetchFiles(currentPath);
    }, [currentPath]);

    const fetchFiles = async (path) => {
        try {
            const response = await fetch(`http://localhost:8080/api/ls`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ feature: "LS", params: [path], project: "project" }),
            });

            if (!response.ok) {
                throw new Error('Failed to load directory');
            }

            const data = await response.json();
            setFolders(data.folders);
            setFiles(data.files);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleInputChange = (event) => {
        setInputPath(event.target.value);
    };

    const handleInputSubmit = () => {
        setHistory([...history, currentPath]);
        if (inputPath.trim() === "") {
            console.log("here");
            setInputPath("/");
            setCurrentPath("/");
        } else {
            setCurrentPath(inputPath);
        }
    };

    const handleGoBack = () => {
        const newPath = history.pop();
        setCurrentPath(newPath);
        setHistory(history);
    };

    const handleFolderClick = (folder) => {
        setHistory(prevHistory => [...prevHistory, currentPath]);
        const newPath = `${currentPath}${folder}/`;
        setCurrentPath(newPath);
        setInputPath(newPath);
    };

    const handleSaveClick = () => {
        if (filename) {
            onSubmitFile(`${currentPath}${filename}`);
        } else {
            setError('Please enter a filename');
        }
    };

    return (
        <div className="file-selector-overlay">
            <div className="file-selector-content" ref={fileSelectorRef}>
                <div className="file-explorer">
                    <div className="path">Current path: {currentPath}</div>
                    <div className="input-path">
                        <input type="text" value={currentPath} onChange={handleInputChange} />
                        <button onClick={handleInputSubmit}>Go</button>
                    </div>
                    <div className="buttons">
                        <button onClick={handleGoBack} disabled={history.length === 0}>Back</button>
                        <button onClick={onClose}>Close</button>
                    </div>
                    <div className="folders">
                        <h3>Folders</h3>
                        {folders.length === 0 && <p className="empty-message">No folder</p>}
                        {folders.map((folder, index) => (
                            <div key={index} className="folder-item" onClick={() => handleFolderClick(folder)}>
                                {folder}
                            </div>
                        ))}
                    </div>
                    <div className="files">
                        <h3>Files</h3>
                        {files.length === 0 && <p className="empty-message">No file</p>}
                        {files.map((file, index) => (
                            <div key={index} className="file-item" onClick={() => setFilename(file)}>
                                {file}
                            </div>
                        ))}
                    </div>
                    <div className="save-input">
                        <input
                            type="text"
                            placeholder="Enter filename"
                            value={filename}
                            onChange={(e) => setFilename(e.target.value)}
                        />
                        <button onClick={handleSaveClick}>Save</button>
                    </div>
                </div>
            </div>
            {error && <div className="error">{error}</div>}
        </div>
    );
};

export default SaveFileDialog;