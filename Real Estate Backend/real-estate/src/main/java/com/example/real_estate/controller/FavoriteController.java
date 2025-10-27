package com.example.real_estate.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.real_estate.dto.FavoriteDto;
import com.example.real_estate.dto.PropertyDto;
import com.example.real_estate.service.FavoriteService;

@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {

    @Autowired
    private FavoriteService favoriteService;

    // Add favorite
    @PreAuthorize("hasRole('BUYER')")
    @PostMapping
    public ResponseEntity<FavoriteDto> addFavorite(@RequestBody FavoriteDto dto) {
        FavoriteDto response = favoriteService.addFavorite(dto.getPropertyId(), dto.getBuyerId());
        return ResponseEntity.ok(response);
    }

    // Remove favorite
    @PreAuthorize("hasRole('BUYER')")
    @DeleteMapping
    public ResponseEntity<String> removeFavorite(@RequestBody FavoriteDto dto) {
        favoriteService.removeFavoriteByBuyerAndProperty(dto.getBuyerId(), dto.getPropertyId());
        return ResponseEntity.ok("Favorite removed successfully");
    }

  
    @PreAuthorize("hasRole('BUYER') or hasRole('ADMIN')")
    @GetMapping("/user")
    public ResponseEntity<List<PropertyDto>> getFavoritePropertiesByBuyer(@RequestParam Long buyerId) {
        return ResponseEntity.ok(favoriteService.getFavoritePropertiesByBuyer(buyerId));
    }
}
