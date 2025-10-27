package com.example.real_estate.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.real_estate.model.Property;
import com.example.real_estate.model.User;

public interface PropertyRepository extends JpaRepository<Property, Long> {
    List<Property> findByAgent(User agent);
    List<Property> findByTitleContainingIgnoreCase(String title);

    public List<Property> findByAgentId(Long agentId);




}