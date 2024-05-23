import React from 'react';
import './FloatingCalendar.css';

import {Calendar, momentLocalizer} from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {VscClose} from "react-icons/vsc";

const localizer = momentLocalizer(moment);

const FloatingCalendar = ({onClose}) => {
    const events = [
        {
            title: 'Some Event',
            start: new Date(),
            end: new Date(moment().add(1, 'days')),
            allDay: true
        }
    ];
    return (
        <div className="floating-window">
            <div className="overlay" onClick={onClose}></div>
            <div className="window">
                <div style={{textAlign: 'right', cursor: 'pointer'}}>
                    <VscClose size={24} onClick={onClose}/>
                </div>
                <div className="window-content">
                    <Calendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        style={{height: "90vh", width: "90vw"}}
                        defaultView="day"
                        selectable
                    />
                </div>
            </div>
        </div>
    );
};

export default FloatingCalendar;
