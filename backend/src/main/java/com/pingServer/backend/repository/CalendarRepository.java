package com.pingServer.backend.repository;

import com.pingServer.backend.model.Calendar;
import com.pingServer.backend.model.Schedule;
import com.pingServer.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CalendarRepository extends JpaRepository<Calendar, Long> {

    Calendar findAllByName(String name);

}
