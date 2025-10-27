package com.example.real_estate.dto;

import java.util.List;

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
public class PropertyDto {

    @NotNull(message = "ID is required")
    private Long id;
    @NotBlank(message = "Title is mandatory")
    private String title;
    @NotBlank(message = "Description is mandatory")
    private String description;
    @NotNull(message = "Price is mandatory")
    private Double price;
    private String area;
    private String address;
    private Double latitude;
    private Double longitude;
    private List<PropertyImageDto> images;
    private Long agentId;
}
