import React from 'react';

import Editor from '@monaco-editor/react'

const MonacoEditor = ({tab, handleContentChange}) => {
    return (
        <div style={{paddingTop: '10px'}}>
            {tab && <Editor
                height="calc(100vh - 40px)"
                language={tab?.language}
                theme="vs-dark"
                value={tab?.content}
                path={tab?.path}
                onChange={(value) => handleContentChange(tab, value)}
            />}
        </div>

    );
}

export default MonacoEditor;