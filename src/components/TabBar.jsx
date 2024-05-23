import React from "react";
import PropTypes from "prop-types";

import Tab from "./Tab";
import "./TabBar.css";

function TabBar({tabs, activeTab, onTabClick, onCloseTab}) {
    return (
        <div className="tab-bar">
            <div className="tabs-wrapper">
                <div className="tabs-container">
                    {tabs.map(tab => (
                        <Tab key={tab.key} tab={tab} active={tab === activeTab} onClick={onTabClick}
                             onClose={onCloseTab}/>
                    ))}
                </div>
            </div>
        </div>
    );
}

TabBar.propTypes = {
    tabs: PropTypes.arrayOf(PropTypes.shape({
        title: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired,
        language: PropTypes.string.isRequired,
    })).isRequired,
    activeTab: PropTypes.object,
    onTabClick: PropTypes.func.isRequired,
    onCloseTab: PropTypes.func.isRequired,
    onNewTab: PropTypes.func.isRequired,
    onTabChange: PropTypes.func.isRequired,
};

export default TabBar;
