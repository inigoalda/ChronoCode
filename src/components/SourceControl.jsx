import { React } from 'react';

import './SourceControl.css';

const SourceControl = () => {
    return (
        <div className={"source-control"}>
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
        </div>
    );
}

export default SourceControl;