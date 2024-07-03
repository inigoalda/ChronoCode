import React, { useEffect, useRef, useState } from 'react';

import SideBar from './components/SideBar';
import WorkArea from './components/WorkArea';
import FloatingCalendar from "./components/FloatingCalendar";
import { Resizable } from 're-resizable';
import FileTree from "./components/FileTree";
import SearchBar from "./components/SearchBar";
import SourceControl from "./components/SourceControl";
import Maven from "./components/Maven";
import { TbInfinity } from "react-icons/tb";
import PasswordPrompt from './components/PasswordPrompt';

import './App.css';

import Login from './components/Login';

function App() {
    const workAreaRef = useRef();
    const sideBarRef = useRef();

    const [showBar, setShowBar] = useState(false);
    const [currentBar, setCurrentBar] = useState("");
    const [data, setData] = useState(null);
    const [isLogged, setIsLogged] = useState("");
    const [UserId, setUserId] = useState(0);
    const [calendarShown, setCalendarShown] = useState(false);
    const [tabs, setTabs] = useState([]);
    const [areTabsLocked, setAreTabsLocked] = useState(false);
    const [inactiveOverlayVisible, setInactiveOverlayVisible] = useState(false);
    const [passwordPromptVisible, setPasswordPromptVisible] = useState(false);
    const inactivityTimeoutRef = useRef(null);

    const handleOnResultClick = (result) => {
        workAreaRef.current.onSetActiveTab(result);
    }

    const createNewTab = () => {
        workAreaRef.current.onNewTab();
    };

    const logoutUser = () => {
        setTabs([]);
        setData(null);
        setCurrentBar("");
        setUserId(0);
        setIsLogged("");
    }

    const openFile = () => {
        workAreaRef.current.onOpenFile();
    }

    const openFileWithPath = (file) => {
        workAreaRef.current.onOpenFileWithPath(file);
    }

    const openFolder = () => {
        workAreaRef.current.onOpenFolder();
        sideBarRef.current.handleCloseMenu();
    }

    const closeFolder = () => {
        setData(null);
        sideBarRef.current.handleCloseMenu();
    }

    const openMeetingPopup = () => {
        workAreaRef.current.onRemindNextMeeting();
    }

    const saveFile = () => {
        workAreaRef.current.onSaveFile();
        sideBarRef.current.handleCloseMenu();
    }

    const saveProject = () => {
        workAreaRef.current.onSaveProject();
        sideBarRef.current.handleCloseMenu();
    }

    const setBar = (bar) => {
        if (!bar) {
            setShowBar(false);
            return;
        }
        if (currentBar === bar) {
            setShowBar(!showBar);
        } else {
            setShowBar(true);
            setCurrentBar(bar);
        }
    }

    const handleSetData = (data) => {
        // must parse the json here
        setData(data);
    }

    const resetInactivityTimer = () => {
        if (inactivityTimeoutRef.current) {
            clearTimeout(inactivityTimeoutRef.current);
        }
        if (!inactiveOverlayVisible && !passwordPromptVisible) {
            inactivityTimeoutRef.current = setTimeout(() => {
                setInactiveOverlayVisible(true);
                setPasswordPromptVisible(true);
                setCalendarShown(false);
            }, 5 * 60 * 1000); // 5 minutes
        }
    };

    const handlePasswordSubmit = async (password) => {
        const loginData = {
            username: isLogged,
            password: password,
        };
        try {
            const response = await fetch('http://localhost:8081/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
            });
            if (response.ok) {
                const data = await response.json();
                if (data.statusCode === 200) {
                    setInactiveOverlayVisible(false);
                    setPasswordPromptVisible(false);
                    resetInactivityTimer();
                }
                else {
                    alert('Incorrect password, please try again.');
                }

            } else {
                const errorData = await response.json();
                alert('Incorrect password, please try again.');
            }
        } catch (error) {
            alert('Incorrect password, please try again.');
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        resetInactivityTimer();
        const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];

        const resetTimer = () => resetInactivityTimer();

        events.forEach(event => window.addEventListener(event, resetTimer));

        return () => {
            events.forEach(event => window.removeEventListener(event, resetTimer));
        };
    }, []);

    useEffect(() => {
        const checkNextEvent = async () => {
            try {
                const response = await fetch(`http://localhost:8081/nextevent/${UserId}`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    if (data.statusCode === 200) {
                        console.log(data);
                        const { timeUntilNext, inMeeting, message, statusCode } = data;
                        setAreTabsLocked(inMeeting);
                        if (timeUntilNext == 15) {
                            workAreaRef.current.onRemindNextMeeting();
                        }
                    }
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };
        checkNextEvent();

        const interval = setInterval(() => {
            checkNextEvent();
        }, 1000 * 31);

        return () => clearInterval(interval);
    }, [UserId]);


    return (<div>
        {!isLogged && <Login userHandler={(username, id) => {
            setIsLogged(username);
            setUserId(id);
        }} />}
        {isLogged && <div>
            {calendarShown && <FloatingCalendar onClose={() => setCalendarShown(false)} userId={UserId} />}
            {passwordPromptVisible && (
                <PasswordPrompt
                    onSubmit={handlePasswordSubmit} userId={UserId}
                />
            )}
            <div className="header">
                <div className='Title'>
                    <h2>ChronoCode</h2>
                    <TbInfinity style={{fontSize: '30px', color: 'white', marginTop: '-10px'}} />
                </div>
                <p className='username'>{isLogged}</p>
            </div>

            <div className="App" style={{ display: 'flex' }}>
                <SideBar createNewTab={createNewTab} showCalendar={() => setCalendarShown(true)}
                    logoutUser={logoutUser} openFile={openFile} ref={sideBarRef} saveFile={saveFile} saveProject={saveProject}
                    setShowBar={setBar} openFolder={openFolder} openMeetingPopup={openMeetingPopup} setAreTabsLocked={setAreTabsLocked} closeFolder={closeFolder} />
                {showBar && (
                    <Resizable
                        className={"bar"}
                        defaultSize={{
                            width: 250,
                        }}
                        enable={{
                            top: false,
                            right: true,
                            bottom: false,
                            left: false,
                        }}
                        onResize={(event, direction, ref, d) => {
                            if (ref.offsetWidth < 100) {
                                sideBarRef.current.handleActiveClose();
                                setShowBar(false);
                            }
                        }}
                    >
                        <div className="bar">
                            {currentBar === 'VscFiles' && <FileTree data={data} openFolder={openFolder} openFile={openFileWithPath} />}
                            {currentBar === 'VscSearch' && <SearchBar data={data} openFolder={openFolder} tabs={tabs} onResultClick={handleOnResultClick} />}
                            {currentBar === 'VscSourceControl' && <SourceControl data={data} openFolder={openFolder} />}
                            {currentBar === 'SiApachemaven' && <Maven data={data} openFolder={openFolder} />}
                        </div>
                    </Resizable>
                )}
                <WorkArea ref={workAreaRef} handleSetData={handleSetData} tabs={tabs} setTabs={setTabs}
                    areTabsLocked={areTabsLocked} setAreTabsLocked={setAreTabsLocked} />
            </div>
        </div>}
    </div>);
}

export default App;
