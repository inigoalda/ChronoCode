import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import Editor from '@monaco-editor/react';

const MonacoEditor = forwardRef(({ tab, handleContentChange }, ref) => {
    const editorRef = useRef(null);

    useImperativeHandle(ref, () => ({
        setPosition(position) {
            if (editorRef.current) {
                const editor = editorRef.current;
                editor.focus();
                editor.setPosition(position);
                editor.revealPositionInCenter(position);

            }
        },
        focus() {
            if (editorRef.current) {
                editorRef.current.focus();
            }
        }
    }));

    const handleEditorDidMount = (editor) => {
        editorRef.current = editor;
    };
    console.log(tab);
    return (
        <div style={{ paddingTop: '10px' }}>
            {tab && (
                <Editor
                    height="calc(100vh - 70px)"
                    language={tab.language}
                    theme="vs-dark"
                    value={tab.content}
                    path={tab.path}
                    onChange={(value) => handleContentChange(tab, value)}
                    onMount={handleEditorDidMount}
                />
            )}
        </div>
    );
});

export default MonacoEditor;
