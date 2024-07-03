package com.pingServer.backend.service;

import com.pingServer.backend.model.Calendar;
import com.pingServer.backend.model.Schedule;
import com.pingServer.backend.model.User;
import com.pingServer.backend.repository.CalendarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.awt.*;
import java.util.List;

@Service
public class CalendarService {


    @Autowired
    private CalendarRepository calendarRepository;

    public boolean createCalendar(Calendar calendar)
    {
        if (calendarRepository.findAllByName(calendar.getName()) != null)
        {
            return false;
        }
        calendarRepository.save(calendar);
        return true;
    }


}
