import { React } from 'react';

import './Maven.css';

const Maven = (props) => {
    const noMaven = () => {
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
                    MAVEN
                </p>
                <p style={
                    {
                        color: "white",
                        margin: "0",
                        padding: "10px",
                        paddingLeft: "20px",
                    }
                }>
                    You have not yet opened a Maven project.
                </p>
                <div className="file-tree">
                    <button className="vscode-button" onClick={props.openFolder}>Open Folder</button>
                </div>
            </div>);
    }

    if (!props.data) {
        return noMaven();
    }

    let isMaven = false;
    for (let i = 0; i < props.data.files.length; i++) {
        if (props.data.files[i].title === "pom.xml") {
            isMaven = true;
            break;
        }
    }

    if (!isMaven) {
        return noMaven();
    }

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
                MAVEN
            </p>
            <div className="file-tree">
                <button className="vscode-button">Maven Install</button>
                <button className="vscode-button">Maven Clean</button>
                <button className="vscode-button">Maven Package</button>
                <button className="vscode-button">Maven Test</button>
            </div>
        </div>
    );
}

export default Maven;