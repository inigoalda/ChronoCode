import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './PasswordPrompt.css'; // Add CSS for layout and styling

const localizer = momentLocalizer(moment);

const PasswordPrompt = ({ onSubmit, userId }) => {
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(password);
    };

    const [schedule, setSchedule] = useState([]);
    const [error, setError] = useState('');
    const [myEvents, setMyEvents] = useState([]);

    const Colors = ["#ffb3ba", "#ffdfba", "#ffffba", "#baffc9", "#bae1ff"]

    const myEventsList = myEvents;

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



    return (
        <div className="password-prompt-container">
            <div className="password-prompt-side">
                <h2>Are you still there?</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                    />
                    <button type="submit">Submit</button>
                </form>
            </div>
            <div className="calendar-side">
                <Calendar
                    localizer={localizer}
                    events={myEventsList}
                    startAccessor="start"
                    endAccessor="end"
                />
            </div>
        </div>
    );
};

export default PasswordPrompt;

