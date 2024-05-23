import React, {useRef} from 'react';

import SideBar from './components/SideBar';
import WorkArea from './components/WorkArea';
import './App.css';

function App() {

    const workAreaRef = useRef();

    const createNewTab = () => {
        workAreaRef.current.onNewTab();
    };

    return (
        <div className="Outer">
            <div className="header">
                <h1>Proto-Ping</h1>
            </div>

            <div className="App" style={{display: 'flex'}}>
                <SideBar createNewTab={createNewTab}/>
                <WorkArea ref={workAreaRef}/>
            </div>
        </div>

    );
}

export default App;