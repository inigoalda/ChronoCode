import React, { useEffect, useRef, useState } from "react";
import "./MeetingPopup.css";

const MeetingPopup = ({ onAcknowledgeMeeting }) => {
    const meetingPopupRef = useRef(null);

    const handleAcknowledge = () => {
        onAcknowledgeMeeting();
    };

    const handleClickOutside = (event) => {
        if (
            meetingPopupRef.current &&
            !meetingPopupRef.current.contains(event.target)
        ) {
            handleAcknowledge();
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="meeting-popup-overlay">
            <div className="meeting-popup-content" ref={meetingPopupRef}>
                <div className="meeting-popup-text">
                    Your next meeting is in 15 minutes. <br/>
                    Your code edition tools will be locked during the meeting.
                </div>
                <button onClick={handleAcknowledge}>OK</button>
            </div>
        </div>
    );
};

export default MeetingPopup;
