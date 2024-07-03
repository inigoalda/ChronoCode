package com.pingServer.backend.controller;


import com.pingServer.backend.model.response.EventResponse;
import com.pingServer.backend.model.Calendar;
import com.pingServer.backend.model.response.ListResponse;
import com.pingServer.backend.model.response.Response;
import com.pingServer.backend.model.Schedule;
import com.pingServer.backend.model.User;
import com.pingServer.backend.service.CalendarService;
import com.pingServer.backend.service.ScheduleService;
import com.pingServer.backend.service.UserService;

import com.pingServer.backend.utils.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:8080")
public class UsersController {
    @Autowired
    private UserService userService;

    @Autowired
    private ScheduleService scheduleService;

    @Autowired
    private CalendarService calendarService;

    @GetMapping
    public String home()
    {
        return "Hello World!";
    }

    @GetMapping("/users")
    public List<User> getAllUsers() {
        Logger.log("Getting All Users");
        return userService.getAllUsers();
    }

    @PostMapping(value = "/login", consumes = MediaType.APPLICATION_JSON_VALUE)
    public Response loginUser(@RequestBody final User user)
    {
        Logger.log("Log in user");
        Response response = new Response();
        User u = userService.loginUser(user);
        if( u != null)
        {
            response.setMessage("User successfully login.");
            response.setStatusCode(200);
        }
        else {
            response.setMessage("Username unknown or bad password.");
            response.setStatusCode(422);
        }
        user.setPassword(null);
        response.setData(user);
        return response;
    }

    @PostMapping(value = "/signin", consumes = MediaType.APPLICATION_JSON_VALUE)
    public Response createUser(@RequestBody final User user)
    {
        Logger.log("Sign in user");
        Response response = new Response();
        if(userService.createUser(user))
        {
            response.setMessage("User successfully created");
            response.setStatusCode(200);
        }
        else
        {
            response.setMessage("Error on user creation");
            response.setStatusCode(422);
        }
        return response;
    }

    @PostMapping(value = "/calendar", consumes = MediaType.APPLICATION_JSON_VALUE)
    public Response createUser(@RequestBody final Calendar calendar)
    {
        Logger.log("Create calendar");
        Response response = new Response();
        if(calendarService.createCalendar(calendar))
        {
            response.setMessage("Calendar successfully created");
            response.setStatusCode(200);
        }
        else
        {
            response.setMessage("Error on user creation");
            response.setStatusCode(422);
        }
        return response;
    }

    @PostMapping(value = "/event", consumes = MediaType.APPLICATION_JSON_VALUE)
    public Response createSchedule(@RequestBody final Schedule schedule)
    {
        Logger.log("Create Event");
        Response response = new Response();
        if(scheduleService.createSchedule(schedule))
        {
            response.setMessage("event successfully created");
            response.setStatusCode(200);
        }
        else
        {
            response.setMessage("Error on event creation");
            response.setStatusCode(422);
        }
        return response;
    }

    @GetMapping(value = "/events", produces = MediaType.APPLICATION_JSON_VALUE)
    public ListResponse allCalendar()
    {
        Logger.log("Get all events");
        ListResponse listResponse = new ListResponse();
        listResponse.setStatusCode(200);
        listResponse.setMessage("All events");
        listResponse.setData(scheduleService.getAll());
        return listResponse;
    }
    @GetMapping(value = {"/events/{userId}"}, produces = MediaType.APPLICATION_JSON_VALUE)
    public ListResponse allEventsForUser(@PathVariable Integer userId)
    {
        Logger.log("Get all events for user: " + userId);
        ListResponse listResponse = new ListResponse();

        if(userId == null)
        {
            listResponse.setStatusCode(422);
            listResponse.setMessage("No ID provided");
            return listResponse;
        }

        User u = userService.getUserById(userId.longValue());
        if (u != null)
        {

            listResponse.setStatusCode(200);
            listResponse.setMessage("All events");
            listResponse.setData(scheduleService.allEvents(u));
        }
        else
        {
            listResponse.setStatusCode(422);
            listResponse.setMessage("Unknown user ID");
        }
        return listResponse;
    }

    @GetMapping(value = {"/nextevent/{userId}"}, produces = MediaType.APPLICATION_JSON_VALUE)
    public EventResponse NextEventForUser(@PathVariable Integer userId)
    {
        Logger.log("Get next event for user: " + userId);
        EventResponse response = new EventResponse();

        if(userId == null)
        {
            response.setStatusCode(422);
            response.setMessage("No ID provided");
            return response;
        }

        User u = userService.getUserById(userId.longValue());
        if (u != null)
        {
            // paris time local now
            LocalDateTime localDate = LocalDateTime.now(ZoneId.of("Europe/Paris"));
            Duration shortestDuration = null;
            Boolean inMeeting = false;
            Logger.log(localDate.toString());
            for (Schedule e : scheduleService.allEvents(u)){
                Duration duration = Duration.between(localDate, e.getStart_date());
                if (!duration.isNegative() && (shortestDuration == null || duration.compareTo(shortestDuration) < 0)) {
                        shortestDuration = duration;
                } else if (duration.isNegative() && !(Duration.between(localDate, e.getEnd_date()).isNegative())){
                    inMeeting = true;
                }
            }

            if (shortestDuration == null){
                response.setStatusCode(200);
                response.setTimeUntilNext(-1L);
                response.setInMeeting(inMeeting);
                response.setMessage("No upcoming event");
            } else {
                response.setStatusCode(200);
                response.setTimeUntilNext(shortestDuration.toMinutes());
                response.setInMeeting(inMeeting);
                response.setMessage("Found");
            }

        }
        else
        {
            response.setStatusCode(422);
            response.setMessage("Unknown user ID");
        }
        return response;
    }
}
