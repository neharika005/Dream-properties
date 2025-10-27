package com.example.real_estate.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class RoleDto {

    @NotNull(message = "ID is required")
    private Long id;
    private String name;

}
