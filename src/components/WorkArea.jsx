import React, { forwardRef, useImperativeHandle, useState } from 'react';
import './WorkArea.css';

import TabBar from './TabBar';
import MonacoEditor from './MonacoEditor';
import FileSelector from './FileSelector';
import FileSelectorError from './FileSelectorError';
import FolderSelector from './FolderSelector';

const WorkArea = forwardRef((props, ref) => {
    useImperativeHandle(ref, () => ({
        onNewTab() {
            handleNewTab();
        },
        onOpenFile() {
            setShowFileSelector(true);
        },
        onOpenFolder() {
            setShowFolderSelector(true);
        },
        onSaveFile() {
            // Implement save file logic here
        }
    }));

    const [tabs, setTabs] = useState([]);
    const [activeTab, setActiveTab] = useState(null);
    const [showFileSelector, setShowFileSelector] = useState(false);
    const [showFolderSelector, setShowFolderSelector] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const handleCloseTab = (tab) => {
        if (tab === activeTab) {
            setActiveTab(null);
        }
        setTabs(tabs.filter(t => t !== tab));
    };

    const handleNewTab = () => {
        const newTab = {
            key: tabs.length + 1, title: `New File`, content: '', language: 'java', path: ''
        };
        setTabs([...tabs, newTab]);
        setActiveTab(newTab);
    };

    const handleTabChange = (tab, value) => {
        tab.content = value;
        setTabs([...tabs]);
    };

    const handleFileSubmit = async (filename) => {
        setShowFileSelector(false);
        if (!filename) return;
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`https://api.example.com/files/${filename}`);
            if (!response.ok) {
                throw new Error('File not found');
            }
            const data = await response.json();
            const newTab = {
                key: tabs.length + 1, title: filename, content: data.content, language: data.language, path: filename
            };
            setTabs([...tabs, newTab]);
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
            const response = await fetch(`https://api.example.com/folders/${foldername}`);
            if (!response.ok) {
                throw new Error('Folder not found');
            }
            const data = await response.json();
            const newTabs = data.files.map((file, index) => {
                return {
                    key: tabs.length + index + 1, title: file.name, content: file.content, language: file.language, path: file.path
                };
            });
            setTabs([...tabs, ...newTabs]);
            setActiveTab(newTabs[0]);
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
            {loading && <div className="loading-overlay">Loading...</div>}
            {error && <FileSelectorError message={error} onClose={handleCloseError} />}
            <TabBar 
                tabs={tabs} 
                activeTab={activeTab} 
                onTabClick={handleTabClick}
                onCloseTab={handleCloseTab} 
                onNewTab={handleNewTab} 
                onTabChange={handleTabChange} 
            />
            <MonacoEditor tab={activeTab} handleContentChange={handleTabChange} />
        </div>
    );
});

export default WorkArea;
