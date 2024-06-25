import React from 'react';
import './FileTree.css';

const FileTree = (props) => {
    if (!props.data) {
        return (
            <div>
                <p style={
                    {
                        color: "white",
                        margin: "0",
                        padding: "10px",
                        paddingLeft: "20px",
                        fontSize: "11px"
                    }
                }>
                    EXPLORER
                </p>
                <p style={
                    {
                        color: "white",
                        margin: "0",
                        padding: "10px",
                        paddingLeft: "20px",
                    }
                }>
                    You have not yet opened a folder.
                </p>
                <div className="file-tree">
                    <button className="vscode-button" onClick={props.openFolder}>Open Folder</button>
                </div>
            </div>
            
        );
    }

    // You might want to return something if props.data exists, or this function will return undefined.
    return null; // Placeholder for further implementation
}

export default FileTree;
