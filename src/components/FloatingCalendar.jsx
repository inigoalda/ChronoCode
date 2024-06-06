import React from 'react';
import './FloatingCalendar.css';

import {Calendar, momentLocalizer} from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {VscClose} from "react-icons/vsc";

const localizer = momentLocalizer(moment);

const FloatingCalendar = ({onClose}) => {
    // use only pastel colors
    const events = [
        {
            title: 'Présentation Maquette',
            start: new Date(moment().toDate()),
            end: new Date(moment().add(1, 'hour').toDate()),
            allDay: false,
            color: '#A5DD9B'
        },
        {
            title: 'Business Call',
            start: new Date(moment().subtract(2, 'hour').toDate()),
            end: new Date(moment().subtract(1, 'hour').toDate()),
            allDay: false,
            color: '#F2C18D'
        },
        {
            title: 'Rest',
            start: new Date(moment().add(1, 'hour').toDate()),
            end: new Date(moment().add(2, 'hour').toDate()),
            allDay: false,
            color: '#FFD3B5'
        },
        {
            title: 'Meeting',
            start: new Date(moment().add(3, 'hour').toDate()),
            end: new Date(moment().add(4, 'hour').toDate()),
            allDay: false,
            color: '#A5DD9B'
        },
        {
            title: 'Dentist',
            start: new Date(moment().add(1, 'day').add(1, 'hour').toDate()),
            end: new Date(moment().add(1, 'day').add(2, 'hour').toDate()),
            allDay: false,
            color: '#FFD3B5'
        },
        {
            title: 'Day Off',
            start: new Date(moment().add(1, 'day').add(2, 'hour').toDate()),
            end: new Date(moment().add(1, 'day').add(3, 'hour').toDate()),
            allDay: true,
            color: '#BED7DC'
        },
        {
            title: 'Meeting',
            start: new Date(moment().add(2, 'day').toDate()),
            end: new Date(moment().add(2, 'day').add(1, 'hour').toDate()),
            allDay: false,
            color: '#A5DD9B'
        },
        {
            title: 'Meeting',
            start: new Date(moment().add(3, 'day').toDate()),
            end: new Date(moment().add(3, 'day').add(1, 'hour').toDate()),
            allDay: false,
            color: '#A5DD9B'
        },
        {
            title: 'Meeting',
            start: new Date(moment().add(4, 'day').toDate()),
            end: new Date(moment().add(4, 'day').add(1, 'hour').toDate()),
            allDay: false,
            color: '#A5DD9B'
        },
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
                        eventPropGetter={(event) => {
                            return {
                                style: {
                                    backgroundColor: event.color
                                }
                            }
                        }}
                        onSelectEvent={event => console.log(event)}
                    />
                </div>
            </div>
        </div>
    );
};

export default FloatingCalendar;
