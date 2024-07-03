import React, { useState, useEffect, useRef } from 'react';
import './FileSelector.css';

const SaveFileDialog = ({ onSubmitFile, onClose, currentFilePath }) => {
    const [currentPath, setCurrentPath] = useState('/');
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
                throw new Error('Failed to fetch');
            }

            const data = await response.json();
            const { folders, files } = data;
            setFolders(folders);
            setFiles(files);
            setError(null);
        } catch (error) {
            setError("Error while fetching data: " + error.message);
        }
    };

    const handleFolderClick = (folder) => {
        setHistory(prevHistory => [...prevHistory, currentPath]);
        const newPath = `${currentPath}${folder}/`;
        setCurrentPath(newPath);
        setInputPath(newPath);
    };

    const handleFileClick = (file) => {
        if (file.trim() === "") {
            setError('Please enter a filename');
            return;
        }
        setFilename(file);
        const fullPath = `${currentPath}${file}`;
        onSubmitFile(fullPath);
    };

    const handleInputSubmit = async () => {
        const trimmedPath = inputPath.trim();
        if (trimmedPath === "") {
            setInputPath("/");
            setCurrentPath("/");
        } else {
            const success = await fetchFiles(trimmedPath);
            if (success) {
                setHistory(prevHistory => [...prevHistory, currentPath]);
                setCurrentPath(trimmedPath);
            }
        }
    };

    const handleGoBack = () => {
        if (history.length > 0) {
            const previousPath = history[history.length - 1];
            setHistory(prevHistory => prevHistory.slice(0, -1));
            setCurrentPath(previousPath);
            setInputPath(previousPath);
        }
    };

    const handleInputChange = (event) => {
        setFilename(event.target.value);
    };

    const handleClickOutside = (event) => {
        if (fileSelectorRef.current && !fileSelectorRef.current.contains(event.target)) {
            onClose();
        }
    };

    const handleSaveClick = () => {
        if (filename.trim() === "") {
            setError('Please enter a filename');
            return;
        }

        const fullPath = `${currentPath}${filename}`;
        onSubmitFile(fullPath);
    };

    const handleSaveAndOverwriteClick = () => {
        if (filename.trim() === "") {
            setError('Please enter a filename');
            return;
        }

        const fullPath = `${currentPath}${filename}`;
        onSubmitFile(fullPath);
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
                <div className="file-explorer">
                    <div className="path">Current path: {currentPath}</div>
                    <div className="input-path">
                        <input type="text" value={inputPath} onChange={(e) => setInputPath(e.target.value)} />
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
                            <div key={index} className="file-item" onClick={() => handleFileClick(file)}>
                                {file}
                            </div>
                        ))}
                    </div>
                    <div className="save-input">
                        <input
                            type="text"
                            placeholder="Enter filename"
                            value={filename}
                            onChange={handleInputChange}
                        />
                        <button onClick={handleSaveClick}>Save as / Overwrite</button>
                        {files.includes(filename) && (
                            <button onClick={handleSaveAndOverwriteClick}>Save and Overwrite</button>
                        )}
                    </div>
                </div>
            </div>
            {error && <div className="error">{error}</div>}
        </div>
    );
};

export default SaveFileDialog;