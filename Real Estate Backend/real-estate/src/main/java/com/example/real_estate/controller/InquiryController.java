package com.example.real_estate.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.real_estate.dto.InquiryDto;
import com.example.real_estate.model.InquiryStatus;
import com.example.real_estate.service.InquiryService;

@RestController
@RequestMapping("/api/inquiries")
public class InquiryController {

    @Autowired
    private InquiryService inquiryService;

    // Send inquiry 
    @PreAuthorize("hasRole('ADMIN') or hasRole('AGENT') or hasRole('BUYER')")
    @PostMapping
    public ResponseEntity<InquiryDto> sendInquiry(@RequestBody InquiryDto dto) {
        return ResponseEntity.ok(inquiryService.sendInquiry(dto));
    }

    // Get inquiries for a property 
    @PreAuthorize("hasRole('ADMIN') or hasRole('AGENT')")
    @GetMapping("/property/{propertyId}")
    public ResponseEntity<List<InquiryDto>> getInquiriesByProperty(@PathVariable Long propertyId) {
        return ResponseEntity.ok(inquiryService.getInquiriesByProperty(propertyId));
    }

    // Get inquiries by buyer
    @PreAuthorize("hasRole('ADMIN') or hasRole('AGENT')")
    @GetMapping("/buyer/{buyerId}")
    public ResponseEntity<List<InquiryDto>> getInquiriesByBuyer(@PathVariable Long buyerId) {
        return ResponseEntity.ok(inquiryService.getInquiriesByBuyer(buyerId));
    }

    // Get all inquiries
    @PreAuthorize("hasRole('ADMIN') or hasRole('AGENT')")
    @GetMapping
    public ResponseEntity<List<InquiryDto>> getAllInquiries() {
        return ResponseEntity.ok(inquiryService.getAllInquiries());
    }

    // Update inquiry status 
    @PreAuthorize("hasRole('ADMIN') or hasRole('AGENT')")
    @PatchMapping("/{id}/status")
    public ResponseEntity<InquiryDto> updateInquiryStatus(
            @PathVariable Long id,
            @RequestParam InquiryStatus status) {

        InquiryDto updated = inquiryService.updateInquiryStatus(id, status);
        return ResponseEntity.ok(updated);
    }

    // Get all inquiries for an agent's listings
    @PreAuthorize("hasRole('ADMIN') or hasRole('AGENT')")
    @GetMapping("/agent/{agentId}")
    public ResponseEntity<List<InquiryDto>> getInquiriesByAgent(@PathVariable Long agentId) {
        return ResponseEntity.ok(inquiryService.getInquiriesByAgent(agentId));
    }

}
