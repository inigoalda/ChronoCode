package com.pingServer.backend.service;

import com.pingServer.backend.model.Calendar;
import com.pingServer.backend.model.User;
import com.pingServer.backend.repository.UserRepository;
import com.pingServer.backend.security.PasswordAuthentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    private PasswordAuthentication passwordAuthentication;

    public UserService()
    {
        this.passwordAuthentication = new PasswordAuthentication();
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    public User getAuthenticate()
    {
        return null;
    }

    public User getUserByName(String name)
    {
        return userRepository.findByUsername(name);
    }

    public boolean createUser(User user) {
        if (userRepository.findByUsername(user.getUsername()) != null)
        {
            return false;
        }
        char[] pass = user.getPassword().toCharArray();
        user.setPassword(passwordAuthentication.hash(pass));
        userRepository.save(user);
        return true;
    }

    public User loginUser(User user) {
        User u = userRepository.findByUsername(user.getUsername());
        if (u != null)
        {
            if (passwordAuthentication.authenticate(user.getPassword().toCharArray(), u.getPassword())) {
                user.setUserId(u.getUserId());
                return u;
            }
        }
        return null;
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public List<Calendar> AllCalendars(User user)
    {
        //return userRepository.findAllByUserId(user);
        return null;
    }
}
