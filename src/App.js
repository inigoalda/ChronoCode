import React, {useRef, useState} from 'react';

import SideBar from './components/SideBar';
import WorkArea from './components/WorkArea';
import FloatingCalendar from "./components/FloatingCalendar";
import {Resizable} from 're-resizable';
import FileTree from "./components/FileTree";
import SearchBar from "./components/SearchBar";
import SourceControl from "./components/SourceControl";

import './App.css';

import Login from './components/Login';

function App() {

    const workAreaRef = useRef();
    const sideBarRef = useRef();

    const [showBar, setShowBar] = useState(false);
    const [currentBar, setCurrentBar] = useState("");
    const [data, setData] = useState(null);
    
    console.log(currentBar)

    const createNewTab = () => {
        workAreaRef.current.onNewTab();
    };

    const logoutUser = () => {
        setIsLogged("");
    }

    const openFile = () => {
        workAreaRef.current.onOpenFile();
        sideBarRef.current.handleCloseMenu();
    }

    const openFolder = () => {
        workAreaRef.current.onOpenFolder();
        sideBarRef.current.handleCloseMenu();
    }

    const saveFile = () => {
        workAreaRef.current.onSaveFile();
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

    const [isLogged, setIsLogged] = useState("asdf");
    const [calendarShown, setCalendarShown] = useState(false);

    return (<div>
            {!isLogged && <Login userHandler={(username) => setIsLogged(username)}/>}
            {isLogged && <div>
                {calendarShown && <FloatingCalendar onClose={() => setCalendarShown(false)}/>}
                <div className="header">
                    <h2>Proto-Ping</h2>
                </div>

                <div className="App" style={{display: 'flex'}}>
                    <SideBar createNewTab={createNewTab} showCalendar={() => setCalendarShown(true)}
                             logoutUser={logoutUser} openFile={openFile} ref={sideBarRef} saveFile={saveFile}
                                setShowBar={setBar} openFolder={openFolder}/>
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
                                left: false,}}
                            onResize={(event, direction, ref, d) => {
                                if (ref.offsetWidth < 100) {
                                    sideBarRef.current.handleActiveClose();
                                    setShowBar(false);
                                }

                            }}
                        >
                            <div className="bar">
                                {currentBar === 'VscFiles' && <FileTree data={data} openFolder={openFolder}/>}
                                {currentBar === 'VscSearch' && <SearchBar/>}
                                {currentBar === 'VscSourceControl' && <SourceControl/>}
                            </div>
                        </Resizable>
                    )}
                    <WorkArea ref={workAreaRef} handleSetData={handleSetData}/>
                </div>
            </div>}
        </div>

    );
}

export default App;