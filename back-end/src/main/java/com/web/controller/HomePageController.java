package com.web.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/homePage")
public class HomePageController {
    @GetMapping
    public ResponseEntity<?> getHome(){
        return ResponseEntity.ok("Home Page");
    }
}
