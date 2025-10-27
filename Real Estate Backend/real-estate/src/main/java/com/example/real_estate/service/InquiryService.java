package com.example.real_estate.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.real_estate.dto.InquiryDto;
import com.example.real_estate.exception.ResourceNotFoundException;
import com.example.real_estate.model.Inquiry;
import com.example.real_estate.model.InquiryStatus;
import com.example.real_estate.model.Property;
import com.example.real_estate.model.User;
import com.example.real_estate.repository.InquiryRepository;
import com.example.real_estate.repository.PropertyRepository;
import com.example.real_estate.repository.UserRepository;

@Service
public class InquiryService {

    @Autowired
    private InquiryRepository inquiryRepository;

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private UserRepository userRepository;

    //send inquiry 
    public InquiryDto sendInquiry(InquiryDto dto) {
        Property property = propertyRepository.findById(dto.getPropertyId())
                .orElseThrow(() -> new ResourceNotFoundException("Property not found"));

        User buyer = userRepository.findById(dto.getBuyerId())
                .orElseThrow(() -> new ResourceNotFoundException("Buyer not found"));

        Inquiry inquiry = Inquiry.builder()
                .buyer(buyer)
                .property(property)
                .name(dto.getName())
                .email(dto.getEmail())
                .message(dto.getMessage())
                .status(InquiryStatus.PENDING) 
                .build();

        Inquiry saved = inquiryRepository.save(inquiry);
        return mapToDto(saved);
    }

    //update inquiry status 
    public InquiryDto updateInquiryStatus(Long inquiryId, InquiryStatus newStatus) {
        Inquiry inquiry = inquiryRepository.findById(inquiryId)
                .orElseThrow(() -> new ResourceNotFoundException("Inquiry not found"));

        inquiry.setStatus(newStatus);
        Inquiry updated = inquiryRepository.save(inquiry);

        return mapToDto(updated);
    }
    //inquriy of a property 
    public List<InquiryDto> getInquiriesByProperty(Long propertyId) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found"));

        return inquiryRepository.findByProperty_Id(propertyId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    //inquiries by buyer 
    public List<InquiryDto> getInquiriesByBuyer(Long buyerId) {
        User buyer = userRepository.findById(buyerId)
                .orElseThrow(() -> new ResourceNotFoundException("Buyer not found"));

        return inquiryRepository.findByBuyer(buyer)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    //all inquiries 
    public List<InquiryDto> getAllInquiries() {
        return inquiryRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    //by agent 
    public List<InquiryDto> getInquiriesByAgent(Long agentId) {
        List<Property> properties = propertyRepository.findByAgentId(agentId);

        if (properties.isEmpty()) {
            return List.of();
        }
        List<Long> propertyIds = properties.stream().map(Property::getId).toList();

        List<Inquiry> inquiries = inquiryRepository.findByProperty_IdIn(propertyIds);

        return inquiries.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    //mapping 
    private InquiryDto mapToDto(Inquiry inquiry) {
        return InquiryDto.builder()
                .id(inquiry.getId())
                .name(inquiry.getName())
                .email(inquiry.getEmail())
                .message(inquiry.getMessage())
                .status(inquiry.getStatus())
                .propertyId(inquiry.getProperty().getId())
                .propertyTitle(inquiry.getProperty().getTitle())
                .buyerId(inquiry.getBuyer().getId())
                .createdAt(inquiry.getCreatedAt())
                .updatedAt(inquiry.getUpdatedAt())
                .build();
    }
}
