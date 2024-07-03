package com.pingServer.backend.model.response;

public class EventResponse {
    private int statusCode;
    private String message;
    private Long timeUntilNext;
    private Boolean inMeeting;


    public Long getTimeUntilNext() {
        return timeUntilNext;
    }

    public void setTimeUntilNext(Long timeUntilNext) {
        this.timeUntilNext = timeUntilNext;
    }

    public Boolean getInMeeting() {
        return inMeeting;
    }

    public void setInMeeting(Boolean inMeeting) {
        this.inMeeting = inMeeting;
    }

    public int getStatusCode() {
        return statusCode;
    }

    public void setStatusCode(int statusCode) {
        this.statusCode = statusCode;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
