import React from 'react';
import './FileTree.css';
import FolderTree from 'react-folder-tree';

const FileTree = (props) => {    
    if (!props.data) {
        return (
            <div>
                <p style={{ color: "white", margin: "0", padding: "10px", paddingLeft: "20px", fontSize: "11px" }}>
                    EXPLORER
                </p>
                <p style={{ color: "white", margin: "0", padding: "10px", paddingLeft: "20px" }}>
                    You have not yet opened a folder.
                </p>
                <div className="file-tree">
                    <button className="vscode-button" onClick={props.openFolder}>Open Folder</button>
                </div>
            </div>
        );
    }
    const onNameClick = ({ defaultOnClick, nodeData }) => {
        defaultOnClick();
        const {
            name, customPath, language
        } = nodeData;
        if (customPath) {
            props.openFile({ title: name, path: customPath, language });
        }
    };

    let treeState = {};
    const parseData = (data) => {
        console.log(data);
        treeState = {
            name: " "+data.folderName,
            children: [],
        };
        const addFolders = (node, folders) => {
            folders.forEach(folder => {
                let newNode = {
                    name: " "+folder.folderName,
                    children: [],
                };
                node.children.push(newNode);
                addFolders(newNode, folder.folders);
                addFiles(newNode, folder.files);
            });
        };
        const addFiles = (node, files) => {
            files.forEach(file => {
                let newNode = {
                    name: " " + file.title,
                    customPath: file.Path,
                    language: file.language,
                };
                node.children.push(newNode);
            });
        };
        addFolders(treeState, data.folders);
        addFiles(treeState, data.files);
    };
    parseData(props.data);
    return (
        <div>
            <p style={{ color: "white", margin: "0", padding: "10px", paddingLeft: "20px", fontSize: "11px" }}>
                EXPLORER - {props.data.folderName}
            </p>
            <div className="file-tree">
                <FolderTree data = { treeState } showCheckbox = { false } indentPixels = { 10 } readOnly onNameClick={onNameClick} initOpenStatus={true} />
            </div>
        </div>
    );
}

export default FileTree;
