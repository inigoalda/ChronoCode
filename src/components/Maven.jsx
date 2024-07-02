import { React } from 'react';

import './Maven.css';

const Maven = (props) => {
    console.log(props);
    async function callMavenFeature(featureName) {
        if (featureName !== "INSTALL" &&
            featureName !== "CLEAN" &&
            featureName !== "PACKAGE" &&
            featureName !== "TEST"
        ) return;

        var execData = {
            feature: featureName,
            params: [],
            project: "useless"
        };

    const response = await fetch('http://localhost:8080/api/execFeature', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(execData),
    });
    if (response.ok) {
        const data = await response.json();
        // TODO
    } else {
        const errorData = await response.json();
        console.log(errorData);
    }
    }

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
                <button className="vscode-button" onClick={() => callMavenFeature("INSTALL")}>Maven Install</button>
                <button className="vscode-button" onClick={() => callMavenFeature("CLEAN")}>Maven Clean</button>
                <button className="vscode-button" onClick={() => callMavenFeature("PACKAGE")}>Maven Package</button>
                <button className="vscode-button" onClick={() => callMavenFeature("TEST")}>Maven Test</button>
            </div>
        </div>
    );
}

export default Maven;