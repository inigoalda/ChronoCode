import { React, useEffect, useState, useCallback } from 'react';
import './FloatingCalendar.css';

import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { VscClose, VscAdd } from "react-icons/vsc";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import AddEvent from './AddEvent';

const DragAndDropCalendar = withDragAndDrop(Calendar)

const localizer = momentLocalizer(moment);

const FloatingCalendar = ({ onClose, userId }) => {

    const [schedule, setSchedule] = useState([]);
    const [error, setError] = useState('');
    const [myevents, setMyEvents] = useState([]);
    const [add, setAdd] = useState(false);

    const Colors = ["#ffdfba", "#ffdfba", "#ffffba", "#baffc9", "#bae1ff"]

    useEffect(() => {
        const FetchData = async () => {

            try {
                const response = await fetch(`http://localhost:8081/events/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    const events = [];
                    if (data.statusCode === 200) {
                        setError("");
                        setSchedule(() => data.data);
                        data.data.forEach(element => {
                            events.push({
                                title: element.name,
                                start: new Date(element.start_date),
                                end: new Date(element.end_date),
                                allDay: false,
                                color: Colors[element.calendar.calendarId]
                            })
                        });
                        setMyEvents(events);
                    }
                    else {
                        setError(data.message || "Login failed");
                        console.error("ERROR");
                    }

                } else {
                    const errorData = await response.json();
                    setError(errorData.message || 'Login failed');
                    console.error("ERROR");
                }
            } catch (error) {
                setError('An error occurred. Please try again.');
                console.error('Error:', error);
            }
        };

        FetchData();
    }, []);

    /*
    const events = [
        {
            title: 'Présentation Maquette',
            start: new Date(moment().toDate()),
            end: new Date(moment().add(1, 'hour').toDate()),
            allDay: false,
            color: '#A5DD9B'
        },
    ];
    */
    const moveEvent = useCallback(
        ({ event, start, end, isAllDay: droppedOnAllDaySlot = false }) => {
            const { allDay } = event
            if (allDay || droppedOnAllDaySlot) {
                event.allDay = true
            }
            if (!allDay && !droppedOnAllDaySlot) {
                event.allDay = false;
            }
            console.log(event.allDay);

            setMyEvents((prev) => {
                const existing = prev.find((ev) => ev.id === event.id) ?? {}
                const filtered = prev.filter((ev) => ev.id !== event.id)
                const returned = [...filtered, { ...existing, start, end, allDay: event.allDay }]
                console.log(returned);
                return returned;
            })
        },
        [setMyEvents]
    )

    const resizeEvent = useCallback(
        ({ event, start, end }) => {
            setMyEvents((prev) => {
                const existing = prev.find((ev) => ev.id === event.id) ?? {}
                const filtered = prev.filter((ev) => ev.id !== event.id)
                return [...filtered, { ...existing, start, end }]
            })
        },
        [setMyEvents]
    )


    const handleOpenAdd = () => {
        setTimeout(() => setAdd(true), 0);
    }

    return (
        <div className="floating-window">
            <div className="overlay" onClick={onClose}></div>
            <div className="window">
                <div style={{ textAlign: 'right', cursor: 'pointer' }}>
                    <VscAdd size={24} onClick={handleOpenAdd} color="white" />
                    <VscClose size={24} onClick={onClose} color="white" />
                </div>
                <div className="window-content">
                    {add && <AddEvent onCloseAdd={() => setAdd(false)} id={userId} />}
                    <DragAndDropCalendar
                        localizer={localizer}
                        events={myevents}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: "90vh", width: "90vw" }}
                        defaultView="day"
                        eventPropGetter={(event) => {
                            return {
                                style: {
                                    backgroundColor: event.color,
                                    color: "#000"
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