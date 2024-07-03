import React, { useEffect, useRef, useState } from 'react';
import "./AddEvent.css"
import { VscClose } from "react-icons/vsc";

const AddEvent = (props) => {
    const [eventName, setEventName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [allDay, setAllDay] = useState(false);
    const [calendar, setCalendar] = useState(0);
    const [responseDataList, setResponseDataList] = useState([]);


    useEffect(() => {
        const getCalandars = async () => {
            try {
                const response = await fetch(`http://localhost:8081/events`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`Erreur HTTP! Statut: ${response.status}`);
                }
                const data = await response.json();

                setResponseDataList(data.data);

            } catch (error) {
                console.error('Erreur lors de la récupération des fichiers :', error);
            }
        };
        getCalandars();
    }, [])


    let userCalendarDict = {};

    responseDataList.forEach(responseData => {
        if (responseData.calendar && responseData.calendar.user) {
            const { userId } = responseData.calendar.user;
            const { calendarId, name } = responseData.calendar;

            userCalendarDict[userId] = { calendarId, name };
        }
    });


    const handleSubmit = async (e) => {
        e.preventDefault();
        const event = {
            name: eventName,
            startDate,
            endDate,
            allDay,
            calendar,
        };
        console.log(event);
        const obj = {
            name: eventName,
            start_date: new Date(startDate).toISOString(),
            end_date: new Date(endDate).toISOString(),
            calendar: {
                calendarId: calendar,
                user: {
                    userId: props.id,
                    username: "bidon",
                    password: "bidon"
                }
            }
        }
        try {
            const response = await fetch(`http://localhost:8081/event`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(obj),
            });

            if (!response.ok) {
                throw new Error(`Erreur HTTP! Statut: ${response.status}`);
            }
            const data = await response.json();
        } catch (error) {
            console.error('Erreur lors de la récupération des fichiers :', error);
        }
        props.onCloseAdd();
    };

    return (
        <div className="file-selector-overlay-custom">
            <div className="file-selector-content-custom">
                <div style={{ textAlign: 'right', cursor: 'pointer' }}>
                    <VscClose size={24} onClick={props.onCloseAdd} color="black" />
                </div>
                <form onSubmit={handleSubmit} className="form-custom">
                    <div>
                        <label>
                            Event Name:
                            <input
                                type="text"
                                value={eventName}
                                onChange={(e) => setEventName(e.target.value)}
                                required
                                className='input-custom'
                            />
                        </label>
                    </div>
                    <div>
                        <label>
                            Start Date:
                            <input
                                type="datetime-local"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                required
                                className='input-custom'
                            />
                        </label>
                    </div>
                    <div>
                        <label>
                            End Date:
                            <input
                                type="datetime-local"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                required
                                disabled={allDay}
                                className='input-custom'
                            />
                        </label>
                    </div>
                    <div>
                        <label>
                            All Day:
                            <input
                                type="checkbox"
                                checked={allDay}
                                onChange={(e) => setAllDay(e.target.checked)}
                                className='checkbox-custom'
                            />
                        </label>
                    </div>
                    <div>
                        <label>
                            Calendar:
                            <select
                                value={calendar}
                                onChange={(e) => setCalendar(e.target.value)}
                                required
                                className='select-custom'
                            >
                                <option value="">Select a calendar</option>
                                {Object.entries(userCalendarDict).map(([userId, calendar]) => (
                                    <option key={userId} value={calendar.calendarId}>
                                        {calendar.name}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>
                    <button type="submit" className='button-custom'>Create Event</button>
                </form>
            </div>
        </div>
    );
};


export default AddEvent;