import React from 'react';
import './FileTree.css';

const FileTree = (props) => {
    if (!props.data) {
        return (
            <div className="file-tree">
                <h1>No Open Folder</h1>
                <button className="vscode-button" onClick={props.openFolder}>Open Folder</button>
            </div>
        );
    }

    // You might want to return something if props.data exists, or this function will return undefined.
    return null; // Placeholder for further implementation
}

export default FileTree;
