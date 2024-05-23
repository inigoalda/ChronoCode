import React, {forwardRef, useImperativeHandle, useState} from 'react';
import './WorkArea.css';

import TabBar from './TabBar';
import MonacoEditor from './MonacoEditor';

const WorkArea = forwardRef((props, ref) => {
    useImperativeHandle(ref, () => ({
        onNewTab() {
            handleNewTab();
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