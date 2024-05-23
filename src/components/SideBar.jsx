import React, {useState, useRef} from "react";
import IconItem from "./IconItem";
import OptionsMenu from "./OptionsMenu";
import "./SideBar.css";
import {
    VscMenu, VscFiles, VscSearch, VscSourceControl, VscCalendar, VscAccount, VscSettingsGear, VscTerminal
} from "react-icons/vsc";

function SideBar({createNewTab, showCalendar}) {
    const [activeIcon, setActiveIcon] = useState(null);
    const [isMenuVisible, setMenuVisible] = useState(false);
    const menuRef = useRef(null);

    const handleIconClick = (iconName) => {
        if (iconName === 'VscMenu') {
            setMenuVisible(!isMenuVisible);
        } else if (iconName === activeIcon) {
            setActiveIcon(null);
        } else {
            setMenuVisible(false);
            setActiveIcon(iconName);
        }
    };

    const options = [
        {label: 'New', onClick: createNewTab},
        {label: 'Open', onClick: () => console.log('Open clicked')},
        {label: 'Save', onClick: () => console.log('Save clicked')},
        {label: 'Save As', onClick: () => console.log('Save As clicked')},
        {label: 'Exit', onClick: () => console.log('Exit clicked')},
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
                <OptionsMenu isVisible={isMenuVisible} options={options} onClose={handleCloseMenu}/>
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
                    icon={VscCalendar}
                    onClick={() => showCalendar()}
                    isActive={activeIcon === 'VscCalendar'}
                />
            </div>
            {/* BOTTOM ICONS */}
            <div className="left-bar-bottom">
                <IconItem
                    icon={VscTerminal}
                    onClick={() => handleIconClick('VscTerminal')}
                    isActive={false}
                />
                <IconItem
                    icon={VscAccount}
                    onClick={() => handleIconClick('VscAccount')}
                    isActive={false}
                />
                <IconItem
                    icon={VscSettingsGear}
                    onClick={() => handleIconClick('VscSettingsGear')}
                    isActive={false}
                />
            </div>
        </div>
    );
}

export default SideBar;
