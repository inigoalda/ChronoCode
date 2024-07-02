import React from 'react';
import './Tab.css';
import {VscListFlat} from "react-icons/vsc";
import {VscClose} from "react-icons/vsc";

function Tab({tab, active, onClick, onClose, locked }) {

    const handleMouseDown = (e) => {
        if (e.button === 1) {
            e.preventDefault();
            onClose(tab);
        }
    };

    return (
        <div
            className={`tab ${active ? 'active' : ''}`}
            onClick={() => onClick(tab)}
            onMouseDown={handleMouseDown}
        >
            <div className="tab-container">
                <VscListFlat className="tab-icon"/>
                {locked ? (
                    <span className='locked-message'>Tab locked</span>
                ) : (
                <span>{tab.title}</span>
            )}
                <VscClose className="close-icon" onClick={(e) => {
                    e.stopPropagation();
                    onClose(tab);
                }}/>
            </div>
        </div>
    );
}

export default Tab;
