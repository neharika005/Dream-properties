package com.example.real_estate.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.real_estate.dto.AgentApprovalDto;
import com.example.real_estate.service.UserService;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @PostConstruct
public void init() {
    System.out.println("AdminController loaded!");
}


    @Autowired
    private UserService userService;

    @GetMapping("/agents")
public List<AgentApprovalDto> getAllAgents() {
    try {
        return userService.getAllAgentApprovals();
    } catch (Exception ex) {
        ex.printStackTrace(); // Also log to your log system
        throw ex; // or return a more detailed error if appropriate
    }
}


    @PostMapping("/approve/{agentId}")
    public ResponseEntity<Map<String, String>> approveAgent(@PathVariable Long agentId) {
        boolean result = userService.approveAgentById(agentId);
        if(result) {
            return ResponseEntity.ok(Map.of("message", "Agent approved"));
        }
        return ResponseEntity.badRequest().body(Map.of("message", "Failed approval"));
    }

    @PostMapping("/disapprove/{agentId}")
    public ResponseEntity<Map<String, String>> disapproveAgent(@PathVariable Long agentId) {
        boolean result = userService.disapproveAgentById(agentId);
        if(result) {
            return ResponseEntity.ok(Map.of("message", "Agent disapproved"));
        }
        return ResponseEntity.badRequest().body(Map.of("message", "Failed disapproval"));
    }
}
