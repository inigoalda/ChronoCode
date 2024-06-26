import React, { useState, useEffect } from "react";
import './SourceControl.css'

const SourceControl = () => {
    const [files, setFiles] = useState([]);
    const [pull, setPull] = useState("Pull");

    const handlePull = async () => {
        const execData = {
            feature: "PULL",
            params: [],
            project: "useless"
        };

        try {
            setPull("Loading...")
            setFiles([])
            const response = await fetch('http://localhost:8080/api/execFeature', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(execData),
            });
            if (response.ok) {
                const data = await response.json();
                setFiles(data.added);
                const merge = [...files, ...data.modified];
                setFiles(merge);
            } else {
                const errorData = await response.json();
                setFiles(["Error"]);
            }
        } catch (error) {
            console.error('Error:', error);
            setFiles(["Error"]);
        }
        setPull("Pull")
    };

    const handlePush = () => {
        // TODO
    };

    return (
        <div>
            <p style={{
                color: "white",
                margin: "0",
                padding: "10px",
                paddingLeft: "20px",
                fontSize: "11px"
            }}>
                SOURCE CONTROL
            </p>
            <ul>
                {files.map((file, index) => (
                    <li className="filelist" key={index}><button>ADD</button><p className="file">{file.split('/').pop()}</p><p className="path">{file}</p></li>
                ))}
            </ul>
            <div className={"source-control"}>
                <button className="button" onClick={handlePull}>{pull}</button>
                <button className="button" onClick={handlePush}>Push</button>
            </div>
        </div>
    );
};

export default SourceControl;