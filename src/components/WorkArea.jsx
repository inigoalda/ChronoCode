import React, {forwardRef, useImperativeHandle, useState} from 'react';
import './WorkArea.css';

import TabBar from './TabBar';
import MonacoEditor from './MonacoEditor';

const WorkArea = forwardRef((props, ref) => {
    useImperativeHandle(ref, () => ({
        onNewTab() {
            handleNewTab();
        },
        onOpenFile() {
            // Implement open file logic herem, add new tab with file content
            var file = document.createElement('input');
            file.type = 'file';
            file.accept = '.java';
            file.click();
            file.onchange = function () {
                var reader = new FileReader();
                reader.onload = function (e) {
                    const newTab = {
                        key: tabs.length + 1, title: file.files[0].name, content: e.target.result, language: 'java', path: file.files[0].path
                    };
                    setTabs([...tabs, newTab]);
                    setActiveTab(newTab);
                };
                reader.readAsText(file.files[0]);
            }
        },
        onSaveFile() {
            if (activeTab) {
                var blob = new Blob([activeTab.content], {type: "text/plain;charset=utf-8"});
                var url = URL.createObjectURL(blob);
                var a = document.createElement('a');
                a.href = url;
                a.download = activeTab.title;
                a.click();
                URL.revokeObjectURL(url);
            }
        }
    }));
    const [tabs, setTabs] = useState([]);
    const [activeTab, setActiveTab] = useState(null);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    }

    const handleCloseTab = (tab) => {
        if (tab === activeTab) {
            setActiveTab(null);
        }
        setTabs(tabs.filter(t => t !== tab));
    }

    const handleNewTab = () => {
        const newTab = {
            key: tabs.length + 1, title: `New File`, content: '', language: 'java', path: ''
        };
        setTabs([...tabs, newTab]);
        setActiveTab(newTab);
    }

    const handleTabChange = (tab, value) => {
        tab.content = value;
        setTabs([...tabs]);
    }

    return (<div className="work-area">
        <TabBar tabs={tabs} activeTab={activeTab} onTabClick={handleTabClick}
                onCloseTab={handleCloseTab} onNewTab={handleNewTab} onTabChange={handleTabChange}/>
        <MonacoEditor tab={activeTab} handleContentChange={handleTabChange}/>
    </div>);
});

export default WorkArea;