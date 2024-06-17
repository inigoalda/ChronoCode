import {React, useState} from 'react';

import './FileTree.css';

const FileTree = () => {
    const [files, setFiles] = useState([]);
    return (
        <div className={"file-tree"}>
            <h1>File Tree</h1>
            <ul>
                {files.map((file, index) => {
                    return <li key={index}>{file}</li>
                })}
            </ul>

        </div>
    );
}

export default FileTree;