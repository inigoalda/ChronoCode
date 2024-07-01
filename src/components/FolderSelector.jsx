import React, { useEffect, useRef, useState } from 'react';
import './FolderSelector.css';

const FolderSelector = ({ onSubmitFolder }) => {
    const [currentPath, setCurrentPath] = useState('C:\\');
    const [history, setHistory] = useState([]);
    const [folders, setFolders] = useState([]);
    const [files, setFiles] = useState([]);
    const [selectedPath, setSelectedPath] = useState('');
    const [inputPath, setInputPath] = useState(currentPath);
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
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Fetched data:', data);
            const { folders, files } = data;
            setFolders(folders);
            setFiles(files);
        } catch (error) {
            console.error('Error fetching files:', error);
        }
    };

    const handleFolderClick = (folder) => {
        setHistory(prevHistory => [...prevHistory, currentPath]);
        const newPath = `${currentPath}${folder}/`;
        setCurrentPath(newPath);
        setInputPath(newPath);
    };

    const handleFileClick = (file) => {
        setSelectedPath(`${currentPath}${file}`);
    };

    const handleSubmit = () => {
        onSubmitFolder(selectedPath || currentPath);
    };

    const handleClickOutside = (event) => {
        if (fileSelectorRef.current && !fileSelectorRef.current.contains(event.target)) {
            onSubmitFolder(null);
        }
    };

    const handleGoBack = () => {
        if (history.length > 0) {
            const previousPath = history[history.length - 1];
            setHistory(history.slice(0, -1));
            setCurrentPath(previousPath);
            setInputPath(previousPath);
        }
    };

    const handleInputChange = (event) => {
        setInputPath(event.target.value);
    };

    const handleInputSubmit = () => {
        setHistory(prevHistory => [...prevHistory, currentPath]);
        setCurrentPath(inputPath);
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        fetchFiles(currentPath);
    }, [currentPath]);

    return (
        <div className="file-selector-overlay">
            <div className="file-selector-content" ref={fileSelectorRef}>
                <div className="file-explorer">
                    <div className="path">Current Path: {currentPath}</div>
                    <div className="input-path">
                        <input type="text" value={inputPath} onChange={handleInputChange} />
                        <button onClick={handleInputSubmit}>Go</button>
                    </div>
                    <div className="buttons">
                        <button onClick={handleGoBack} disabled={history.length === 0}>Back</button>
                        <button onClick={handleSubmit}>Choose Folder</button>
                    </div>
                    <div className="folders">
                        <h3>Folders</h3>
                        {folders.map((folder, index) => (
                            <div key={index} className="folder-item" onClick={() => handleFolderClick(folder)}>
                                {folder}
                            </div>
                        ))}
                    </div>
                    <div className="files">
                        <h3>Files</h3>
                        {files.map((file, index) => (
                            <div key={index} className="file-item" onClick={() => handleFileClick(file)}>
                                {file}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FolderSelector;