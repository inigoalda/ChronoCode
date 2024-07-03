package com.pingServer.backend.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;


@Entity
@Table(name="schedules")
public class Schedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long scheduleId;

    private String name;
    private String description;

    @Enumerated(EnumType.STRING)
    private Freq frequency;

    private int days_of_week;
    private int days_of_month;

    private LocalDateTime start_date;
    private LocalDateTime end_date;
    private boolean allDay;

    public boolean isAllDay() {
        return allDay;
    }

    public void setAllDay(boolean allDay) {
        this.allDay = allDay;
    }

    @ManyToOne()
    @JoinColumn(name = "calendar_id")
    private Calendar calendar;

    public Calendar getCalendar() {
        return calendar;
    }

    public void setCalendar(Calendar calendar) {
        this.calendar = calendar;
    }

    public Long getScheduleId() {
        return scheduleId;
    }

    public void setScheduleId(Long scheduleId) {
        this.scheduleId = scheduleId;
    }


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Freq getFrequency() {
        return frequency;
    }

    public void setFrequency(Freq frequency) {
        this.frequency = frequency;
    }

    public int getDays_of_week() {
        return days_of_week;
    }

    public void setDays_of_week(int days_of_week) {
        this.days_of_week = days_of_week;
    }

    public int getDays_of_month() {
        return days_of_month;
    }

    public void setDays_of_month(int days_of_month) {
        this.days_of_month = days_of_month;
    }

    public LocalDateTime getStart_date() {
        return start_date;
    }

    public void setStart_date(LocalDateTime start_date) {
        this.start_date = start_date;
    }

    public LocalDateTime getEnd_date() {
        return end_date;
    }

    public void setEnd_date(LocalDateTime end_date) {
        this.end_date = end_date;
    }
}
