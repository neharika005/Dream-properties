package com.example.real_estate.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.real_estate.dto.PropertyImageDto;
import com.example.real_estate.security.CustomUserDetails;
import com.example.real_estate.service.PropertyImageService;
@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/images")
public class PropertyImageController {

    @Autowired
    private PropertyImageService imageService;

    @PreAuthorize("hasRole('ADMIN') or hasRole('AGENT')")
    @PostMapping("/{propertyId}")
    public ResponseEntity<PropertyImageDto> addImage(
            @PathVariable Long propertyId,
            @RequestBody PropertyImageDto imageDto) {
        PropertyImageDto saved = imageService.addImage(propertyId, imageDto);
        return ResponseEntity.ok(saved);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('AGENT') or hasRole('BUYER')")
    @GetMapping("/property/{propertyId}")
    public ResponseEntity<List<PropertyImageDto>> getImagesByPropertyId(@PathVariable Long propertyId) {
        List<PropertyImageDto> images = imageService.getImagesByPropertyId(propertyId);
        return ResponseEntity.ok(images);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('AGENT') or hasRole('BUYER')")
    @GetMapping("/property/search")
    public ResponseEntity<List<PropertyImageDto>> getImagesByPropertyTitle(@RequestParam String title) {
        List<PropertyImageDto> images = imageService.getImagesByPropertyTitle(title);
        return ResponseEntity.ok(images);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('AGENT') or hasRole('BUYER')")
    @GetMapping("/{imageId}")
    public ResponseEntity<PropertyImageDto> getImageById(@PathVariable Long imageId) {
        PropertyImageDto image = imageService.getImageById(imageId);
        return ResponseEntity.ok(image);
    }

@DeleteMapping("/{imageId}")
@PreAuthorize("hasRole('AGENT') or hasRole('ADMIN')")
public ResponseEntity<String> deleteImage(@PathVariable Long imageId, Authentication authentication) {
    Long currentUserId = ((CustomUserDetails) authentication.getPrincipal()).getId();
    imageService.deleteImage(imageId, currentUserId);
    return ResponseEntity.ok("Deleted successfully");
}


}
