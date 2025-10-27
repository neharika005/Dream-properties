package com.example.real_estate.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PropertyImageDto {

    @NotNull(message = "ID is required")
    private Long id;
    private String imageUrl;
}
