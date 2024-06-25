import { React } from 'react';

import './SourceControl.css';

const SourceControl = () => {
    const handlePull = () => {
        // TODO
    };
    const handlePush = () => {
        // TODO
    };

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
                SOURCE CONTROL
            </p>
            <div className={"source-control"}>
                <button className="button" onClick={handlePull}>Pull</button>
                <button className="button" onClick={handlePush}>Push</button>
            </div>
        </div>
    )
        ;
}

export default SourceControl;