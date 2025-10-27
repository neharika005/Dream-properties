package com.example.real_estate.dto;

import java.time.LocalDateTime;

import com.example.real_estate.model.InquiryStatus;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InquiryDto {

    private Long id;

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Message is required")
    private String message;

    private InquiryStatus status;

    @NotNull(message = "Property ID is required")
    private Long propertyId;

    private String propertyTitle;

    @NotNull(message = "Buyer ID is required")
    private Long buyerId;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
