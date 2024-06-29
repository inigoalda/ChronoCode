import React, {useRef, useState} from 'react';

import SideBar from './components/SideBar';
import WorkArea from './components/WorkArea';
import FloatingCalendar from "./components/FloatingCalendar";
import {Resizable} from 're-resizable';
import FileTree from "./components/FileTree";
import SearchBar from "./components/SearchBar";
import SourceControl from "./components/SourceControl";
import Maven from "./components/Maven";
import { TbInfinity } from "react-icons/tb";

import './App.css';

import Login from './components/Login';

function App() {

    const workAreaRef = useRef();
    const sideBarRef = useRef();

    const [showBar, setShowBar] = useState(false);
    const [currentBar, setCurrentBar] = useState("");
    const [data, setData] = useState(null);

    const handleOnResultClick = (result) => {
        workAreaRef.current.onSetActiveTab(result);
    }
    
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

    const openFileWithPath = (file) => {
        workAreaRef.current.onOpenFileWithPath(file);
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
    const [tabs, setTabs] = useState([]);


    return (<div>
            {!isLogged && <Login userHandler={(username) => setIsLogged(username)}/>}
            {isLogged && <div>
                {calendarShown && <FloatingCalendar onClose={() => setCalendarShown(false)}/>}
                <div className="header">
                    <h2>ChronoCode</h2>
                    <TbInfinity style={{marginTop: "3px", fontSize: '30px', color: 'white'}}/>
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
                                {currentBar === 'VscFiles' && <FileTree data={data} openFolder={openFolder} openFile={openFileWithPath}/> }
                                {currentBar === 'VscSearch' && <SearchBar data={data} openFolder={openFolder} tabs={tabs} onResultClick={handleOnResultClick}/>}
                                {currentBar === 'VscSourceControl' && <SourceControl data={data} openFolder={openFolder}/>}
                                {currentBar === 'SiApachemaven' && <Maven data={data} openFolder={openFolder}/>}
                            </div>
                        </Resizable>
                    )}
                    <WorkArea ref={workAreaRef} handleSetData={handleSetData} tabs={tabs} setTabs={setTabs}/>
                </div>
            </div>}
        </div>

    );
}

export default App;