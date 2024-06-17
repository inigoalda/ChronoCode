import React, {useState, useRef, useImperativeHandle, forwardRef} from "react";
import IconItem from "./IconItem";
import OptionsMenu from "./OptionsMenu";
import "./SideBar.css";
import {
    VscMenu, VscFiles, VscSearch, VscSourceControl, VscCalendar, VscAccount, VscSettingsGear, VscTerminal
} from "react-icons/vsc";

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

    const handleIconClick = (iconName) => {
        if (iconName === 'VscMenu') {
            setMenuVisible(!isMenuVisible);
        } else if (iconName === activeIcon) {
            setActiveIcon(null);
            props.setShowBar(null);
        } else if (iconName === 'VscFiles' || iconName === 'VscSearch' || iconName === 'VscSourceControl') {
            setMenuVisible(false);
            setActiveIcon(iconName);
            props.setShowBar(iconName);
        }
    };

    const options = [
        {label: 'New', onClick: props.createNewTab},
        {label: 'Open', onClick: props.openFile},
        {label: 'Save As', onClick: props.saveFile},
        {label: 'Exit', onClick: props.logoutUser},
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
                    onClick={() => props.showCalendar()}
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
}   );

export default SideBar;
