import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import './WorkArea.css';

import TabBar from './TabBar';
import MonacoEditor from './MonacoEditor';
import FileSelector from './FileSelector';
import FileSelectorError from './FileSelectorError';
import FolderSelector from './FolderSelector';
import SaveFileDialog from './SaveFileDialog';

const WorkArea = forwardRef((props, ref) => {
    const editorRef = useRef(null);

    useImperativeHandle(ref, () => ({
        onNewTab() {
            handleNewTab();
        },
        onOpenFile() {
            setShowFileSelector(true);
        },
        async onOpenFileWithPath(file) {
            let tab = props.tabs.find(t => t.path === file.path);
            if (tab) {
                setActiveTab(tab);
                return;
            }
            let customContent;
            try {
                const response = await fetch(`http://localhost:8080/api/open/file`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ path: file.path }),
                });
                if (!response.ok) {
                    throw new Error('File not found');
                }
                const data = await response.json();
                customContent = data.content;
                const newTab = {
                    key: props.tabs.length + 1, title: file.title, content: customContent, language: file.language, path: file.path
                };
                props.setTabs([...props.tabs, newTab]);
                setActiveTab(newTab);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        },
        onOpenFolder() {
            setShowFolderSelector(true);
        },
        onSaveFile() {
            if (!activeTab) {
                setError('No file to save');
                return;
            }
            setShowSaveFileDialog(true);
        },
        onSaveProject() {
            handleSaveProject();
            return;
        },
        onSetActiveTab(result) {
            let tab = props.tabs.find(t => t.key === result.key);
            setActiveTab(tab);
            if (editorRef.current) {
                editorRef.current.setPosition({ lineNumber: result.line, column: result.position });
                editorRef.current.focus();
            }
        },
        getCurrentFilePath() {
            if (activeTab) {
                return activeTab.path || '';
            }
            return '';
        }
    }));

    const handleSaveProject = async () => {
        setLoading(true);
        setError(null);
        for (let i = 0; i < props.tabs.length; i++){
            try {
                const response = await fetch(`http://localhost:8080/api/update`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        path: props.tabs[i].path,
                        from: 0,
                        to: props.tabs[i].content.length - 1,
                        content: props.tabs[i].content
                    }),
                });
    
                if (!response.ok) {
                    throw new Error('Failed to save project');
                }
    
                const data = await response;
                console.log('Project saved successfully', data);
            } catch (error) {
                setError(error.message);
            }
        }
        setLoading(false);
    };


    const [activeTab, setActiveTab] = useState(null);
    const [showFileSelector, setShowFileSelector] = useState(false);
    const [showFolderSelector, setShowFolderSelector] = useState(false);
    const [showSaveFileDialog, setShowSaveFileDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const handleCloseTab = (tab) => {
        if (tab === activeTab) {
            setActiveTab(null);
        }
        props.setTabs(props.tabs.filter(t => t !== tab));
    };

    const handleNewTab = () => {
        const newTab = {
            key: props.tabs.length + 1, title: `New File`, content: '', language: 'text', path: ''
        };
        props.setTabs([...props.tabs, newTab]);
        setActiveTab(newTab);
    };

    const handleTabChange = (tab, value) => {
        tab.content = value;
        props.setTabs([...props.tabs]);
    };

    const handleFileSubmit = async (filename) => {
        setShowFileSelector(false);
        if (!filename) return;
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://localhost:8080/api/open/file`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ path: filename }),
            });
            if (!response.ok) {
                throw new Error('File not found');
            }
            const data = await response.json();
            let condTitle = filename.includes('/') ? filename.split('/').pop() : filename.split('\\').pop();
            const newTab = {
                key: props.tabs.length + 1, title: condTitle, content: data.content, language: data.language, path: filename
            };
            props.setTabs([...props.tabs, newTab]);
            setActiveTab(newTab);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleFolderSubmit = async (foldername) => {
        setShowFolderSelector(false);
        if (!foldername) return;
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://localhost:8080/api/open/project`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ path: foldername }),
            });
            if (!response.ok) {
                throw new Error('Folder not found');
            }
            const data = await response.json();
            console.log(data);
            props.handleSetData(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveFileSubmit = async (filename) => {
        setShowSaveFileDialog(false);
        if (!filename) return;
        setLoading(true);
        setError(null);
        const tab = props.tabs.find(t => t === activeTab);
        if (!tab) {
            setError('No file to save');
            setLoading(false);
            return;
        }
        try {
            const response = await fetch(`http://localhost:8080/api/create/file`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ path: filename, content: tab.content }),
            });
            if (!response.ok) {
                throw new Error('Failed to save file');
            }
            tab.path = filename;
            tab.title = filename.includes('/') ? filename.split('/').pop() : filename.split('\\').pop();
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseError = () => {
        setError(null);
    };

    return (
        <div className="work-area">
            {showFileSelector && <FileSelector onSubmitFile={handleFileSubmit} />}
            {showFolderSelector && <FolderSelector onSubmitFolder={handleFolderSubmit} />}
            {showSaveFileDialog && <SaveFileDialog onSubmitFile={handleSaveFileSubmit} onClose={() => setShowSaveFileDialog(false)} currentFilePath={activeTab ? activeTab.path : ''} />}
            {loading && <div className="loading-overlay">Loading...</div>}
            {error && <FileSelectorError message={error} onClose={handleCloseError} />}
            <TabBar
                tabs={props.tabs}
                activeTab={activeTab}
                onTabClick={handleTabClick}
                onCloseTab={handleCloseTab}
                onNewTab={handleNewTab}
                onTabChange={handleTabChange}
            />
            <MonacoEditor ref={editorRef} tab={activeTab} handleContentChange={handleTabChange} />
        </div>
    );
});

export default WorkArea;