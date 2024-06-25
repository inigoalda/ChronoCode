import React from 'react';
import './Result.css';
import {FaJava} from "react-icons/fa";
import {DiJavascript1, DiPython} from "react-icons/di";
import {PiFileC, PiFileCpp, PiFileTxt} from "react-icons/pi";


const Result = (props) => {
    const {key, title, content, language, path, line, position} = props.result;
    return (<div className="result" onClick={() => props.onClick(props.result)}>
        <div className="result-title">
    <span style={{display: 'flex', alignItems: 'center', overflow: 'hidden', whiteSpace: 'nowrap'}}>
    {language === 'java' && <FaJava style={{fontSize: '20px', minWidth: '20px'}}/>}
        {language === 'python' && <DiPython style={{fontSize: '20px', minWidth: '20px'}}/>}
        {language === 'javascript' && <DiJavascript1 style={{fontSize: '20px', minWidth: '20px'}}/>}
        {language === 'c' && <PiFileC style={{fontSize: '20px', minWidth: '20px'}}/>}
        {language === 'cpp' && <PiFileCpp style={{fontSize: '20px', minWidth: '20px'}}/>}
        {language === 'text' && <PiFileTxt style={{fontSize: '20px', minWidth: '20px'}}/>}
        {language === 'plaintext' && <PiFileTxt style={{fontSize: '20px', minWidth: '20px'}}/>}
        <span style={{flexShrink: 0, marginLeft: '8px'}}>
    {`${title}`}
  </span>
        {path && <span style={{
            color: 'gray',
            fontSize: '0.7em',
            marginLeft: '8px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            flexGrow: 1
        }}>
    {` - ${path}`}
  </span>}
</span>

        </div>
        <div className="result-line">Line {line}</div>
        <div className="result-content">
            {content.substring(0, position)}
            <span className="result-highlight">
                    {content.substring(position, position + props.query.length)}
                </span>
            {content.substring(position + props.query.length)}
        </div>
    </div>);
};

export default Result;
