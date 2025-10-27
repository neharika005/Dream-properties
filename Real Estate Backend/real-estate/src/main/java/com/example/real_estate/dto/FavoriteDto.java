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
public class FavoriteDto {

    @NotNull(message = "ID is required")
    private Long id;
    @NotNull(message = "Property ID is mandatory")
    private Long propertyId;
    @NotNull(message = "Buyer ID is mandatory")
    private Long buyerId;
    private String message;
}
