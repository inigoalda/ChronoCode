import React, { useState, useRef, useImperativeHandle, forwardRef } from "react";
import IconItem from "./IconItem";
import OptionsMenu from "./OptionsMenu";
import "./SideBar.css";
import {
    VscMenu, VscFiles, VscSearch, VscSourceControl, VscCalendar, VscSettingsGear, VscExclude
} from "react-icons/vsc";
import { SiApachemaven } from "react-icons/si";

const SideBar = forwardRef((props, ref) => {
    useImperativeHandle(ref, () => ({
        handleCloseMenu() {
            setMenuVisible(false);
        },
        handleActiveClose() {
            setActiveIcon(null);
        }
    }));

    const [activeIcon, setActiveIcon] = useState(null);
    const [isMenuVisible, setMenuVisible] = useState(false);
    const menuRef = useRef(null);
    const [accountVisible, setAccountVisible] = useState(false);

    const handleIconClick = (iconName) => {
        if (iconName === 'VscMenu') {
            setMenuVisible(!isMenuVisible);
        } else if (iconName === 'VscSettingsGear') {
            setAccountVisible(!accountVisible);
        } else if (iconName === 'New') {
            setMenuVisible(false);
            setActiveIcon(null);
            props.setShowBar(null);
            props.createNewTab();
        } else if (iconName === activeIcon) {
            setActiveIcon(null);
            props.setShowBar(null);
        } else if (iconName === 'VscFiles' || iconName === 'VscSearch' || iconName === 'VscSourceControl' || iconName === 'SiApachemaven') {
            setMenuVisible(false);
            setActiveIcon(iconName);
            props.setShowBar(iconName);
        }
    };

    const options = [
        { label: 'New', onClick: () => handleIconClick('New') },
        { label: 'Open File', onClick: props.openFile },
        { label: 'Open Folder', onClick: props.openFolder },
        { label: 'Save', onClick: props.saveFile },
        { label: 'Save Project', onClick: props.saveProject },
        { label: 'Exit', onClick: props.logoutUser },
        // Add more options as needed
    ];

    const settingsOptions = [
        // about opens on a new tab a github page with the project
        { label: 'About', onClick: () => window.open('https://github.com/inigoalda/Proto-Ping', '_blank') },
        { label: 'Sign Out', onClick: props.logoutUser },
        // Add more options as needed
    ];

    const handleCloseMenu = () => {
        setMenuVisible(false);
    };

    return (
        <div className="left-bar">
            {/* TOP ICONS */}
            <div className="left-bar-top">
                <IconItem
                    icon={VscMenu}
                    height="35px"
                    fontSize="1.0rem"
                    onClick={() => handleIconClick('VscMenu')}
                    isActive={false}
                />
                <OptionsMenu isVisible={isMenuVisible} options={options} onClose={handleCloseMenu} top="0px" left="48px"/>
                <IconItem
                    icon={VscFiles}
                    onClick={() => handleIconClick('VscFiles')}
                    isActive={activeIcon === 'VscFiles'}
                />
                <IconItem
                    icon={VscSearch}
                    onClick={() => handleIconClick('VscSearch')}
                    isActive={activeIcon === 'VscSearch'}
                />
                <IconItem
                    icon={VscSourceControl}
                    onClick={() => handleIconClick('VscSourceControl')}
                    isActive={activeIcon === 'VscSourceControl'}
                />
                <IconItem
                    icon={SiApachemaven}
                    onClick={() => handleIconClick('SiApachemaven')}
                    isActive={activeIcon === 'SiApachemaven'}
                />
                <IconItem
                    icon={VscCalendar}
                    onClick={() => props.showCalendar()}
                    isActive={activeIcon === 'VscCalendar'}
                />
                <IconItem
                    icon={VscExclude}
                    onClick={() => props.openMeetingPopup()}
                />
            </div>
            {/* BOTTOM ICONS */}
            <div className="left-bar-bottom">
                <OptionsMenu isVisible={accountVisible} options={settingsOptions} onClose={() => setAccountVisible(false)} top="calc(100% - 62px)" left="48px"/>
                <IconItem
                    icon={VscSettingsGear}
                    onClick={() => handleIconClick('VscSettingsGear')}
                    isActive={false}
                />
            </div>
        </div>
    );
});

export default SideBar;