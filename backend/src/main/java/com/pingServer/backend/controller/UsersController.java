package com.pingServer.backend.controller;


import com.pingServer.backend.model.response.ListResponse;
import com.pingServer.backend.model.response.Response;
import com.pingServer.backend.model.Schedule;
import com.pingServer.backend.model.User;
import com.pingServer.backend.service.ScheduleService;
import com.pingServer.backend.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
public class UsersController {

    @Autowired
    private UserService userService;

    @Autowired
    private ScheduleService scheduleService;

    @GetMapping
    public String home()
    {
        return "Hello World!";
    }


    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @PostMapping(value = "/login", consumes = MediaType.APPLICATION_JSON_VALUE)
    public Response loginUser(@RequestBody final User user)
    {
        Response response = new Response();
        if(userService.loginUser(user))
        {
            response.setMessage("User successfully login.");
            response.setStatusCode(200);
        }
        else
        {
            response.setMessage("Username unknown or bad password.");
            response.setStatusCode(422);
        }
        return response;
    }

    @PostMapping(value = "/signin", consumes = MediaType.APPLICATION_JSON_VALUE)
    public Response createUser(@RequestBody final User user)
    {
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

    @PostMapping(value = "/event", consumes = MediaType.APPLICATION_JSON_VALUE)
    public Response createSchedule(@RequestBody final Schedule schedule)
    {
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

    @GetMapping(value = "/event", produces = MediaType.APPLICATION_JSON_VALUE)
    public ListResponse allCalendar()
    {
        ListResponse listResponse = new ListResponse();
        listResponse.setStatusCode(200);
        listResponse.setMessage("All events");
        listResponse.setData(scheduleService.getAll());
        return listResponse;
    }

}
