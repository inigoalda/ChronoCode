import React, { useEffect, useRef, useState } from 'react';
import './FileSelector.css';

const FileSelector = ({ onSubmitFile }) => {
    const [currentPath, setCurrentPath] = useState('/');
    const [history, setHistory] = useState([]);
    const [folders, setFolders] = useState([]);
    const [files, setFiles] = useState([]);
    const [inputPath, setInputPath] = useState(currentPath);
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
                return false;
            }
            const data = await response.json();
            const { folders, files } = data;
            setFolders(folders);
            setFiles(files);
            setError(null);
            return true;
        } catch (error) {
            setError("Error while fetching data: " + error)
        }
    };

    const handleFolderClick = (folder) => {
        setHistory(prevHistory => [...prevHistory, currentPath]);
        const newPath = `${currentPath}${folder}/`;
        setCurrentPath(newPath);
        setInputPath(newPath);
    };

    const handleFileClick = (file) => {
        let selectedFilePath = "";
        if (currentPath[currentPath.length - 1] !== '/' && currentPath !== "/"){
            selectedFilePath = `${currentPath}\\${file}`;
        }
        else{
            selectedFilePath = `${currentPath}${file}`;
        }
        onSubmitFile(selectedFilePath);
    };

    const handleInputSubmit = async () => {
        const previousPath = currentPath;
        if (inputPath.trim() === "" || inputPath === "/") {
            setInputPath("/");
            setCurrentPath("/");
        } else {
            const success = await fetchFiles(inputPath);
            if (success) {
                setHistory(prevHistory => [...prevHistory, currentPath]);
                setCurrentPath(inputPath);
            } else {
                setInputPath(previousPath);
                setCurrentPath(previousPath);   
            }
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

    const handleClickOutside = (event) => {
        if (fileSelectorRef.current && !fileSelectorRef.current.contains(event.target)) {
            onSubmitFile(null);
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
                <div className="file-explorer">
                    <div className="path">Current path : {currentPath}</div>
                    <div className="input-path">
                        <input type="text" value={inputPath} onChange={handleInputChange} />
                        <button onClick={handleInputSubmit}>Go</button>
                    </div>
                    <div className="buttons">
                        <button onClick={handleGoBack} disabled={history.length === 0}>Back</button>
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
                </div>
            </div>
        </div>
    );
};

export default FileSelector;