package com.pingServer.backend.service;

import com.pingServer.backend.model.Schedule;
import com.pingServer.backend.model.User;
import com.pingServer.backend.repository.ScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class ScheduleService {

    @Autowired
    private ScheduleRepository scheduleRepository;

    public boolean createSchedule(Schedule schedule) {
        scheduleRepository.save(schedule);
        return true;
    }

    public List<Schedule> getAll()
    {
        return scheduleRepository.findAll();
    }


    public List<Schedule> allEvents(User user)
    {
        return scheduleRepository.findAllByCalendar_User(user);
    }
}
