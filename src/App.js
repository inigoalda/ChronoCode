import React, {useRef, useState} from 'react';

import SideBar from './components/SideBar';
import WorkArea from './components/WorkArea';
import FloatingCalendar from "./components/FloatingCalendar";
import './App.css';

function App() {

    const workAreaRef = useRef();

    const createNewTab = () => {
        workAreaRef.current.onNewTab();
    };

    const [calendarShown, setCalendarShown] = useState(false);


    return (
        <div className="Outer">
            {calendarShown && <FloatingCalendar onClose={() => setCalendarShown(false)}/>}
            <div className="header">
                <h2>Proto-Ping</h2>
            </div>

            <div className="App" style={{display: 'flex'}}>
                <SideBar createNewTab={createNewTab} showCalendar={() => setCalendarShown(true)}/>
                <WorkArea ref={workAreaRef}/>
            </div>
        </div>

    );
}

export default App;