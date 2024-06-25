import React from 'react';
import './Result.css';

const Result = ({ result, query }) => {
    const { title, content, language, path, line, position } = result;
    console.log(position);
    return (
        <div className="result">
            <div className="result-title">{path ? `${path} - ${title}` : title}</div>
            <div className="result-line">Line {line}</div>
            <div className="result-content">{content}</div>
        </div>
    );
    
};

export default Result;
