package com.example.real_estate.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.real_estate.dto.PropertyDto;
import com.example.real_estate.service.PropertyService;

@RestController
@RequestMapping("/api/properties")
public class PropertyController {

    @Autowired
    private PropertyService propertyService;

    @PostMapping
    public ResponseEntity<PropertyDto> createProperty(@RequestBody PropertyDto propertyDto) {
        PropertyDto created = propertyService.createProperty(propertyDto);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PropertyDto> updateProperty(
            @PathVariable Long id,
            @RequestBody PropertyDto propertyDto) {
        PropertyDto updated = propertyService.updateProperty(id, propertyDto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProperty(@PathVariable Long id) {
        propertyService.deleteProperty(id);
        return ResponseEntity.ok("Property deleted successfully");
    }

    @GetMapping("/{id}")
    public ResponseEntity<PropertyDto> getPropertyById(@PathVariable Long id) {
        PropertyDto property = propertyService.getPropertyById(id);
        return ResponseEntity.ok(property);
    }

    @GetMapping
    public ResponseEntity<List<PropertyDto>> getAllPropertiesByAgentId(
            @RequestParam(required = false) Long agentId
    ) {
        List<PropertyDto> properties;
        if (agentId != null) {
            properties = propertyService.getPropertiesByAgentId(agentId);
        } else {
            properties = propertyService.getAllProperties();
        }
        return ResponseEntity.ok(properties);
    }

    @PostMapping("/search")
    public ResponseEntity<List<PropertyDto>> searchProperties(@RequestBody PropertyDto propertyDto) {
        String title = propertyDto.getTitle();
        List<PropertyDto> results = propertyService.searchByTitle(title);
        return ResponseEntity.ok(results);
    }

    @PostMapping(value = "/upload-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, String>> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "File is empty"));
            }

            String contentType = file.getContentType();
            if (!isValidImageType(contentType)) {
                return ResponseEntity.badRequest().body(Map.of("error", "Only JPEG and PNG files are allowed. Received: " + contentType));
            }

            long maxSize = 5 * 1024 * 1024;
            if (file.getSize() > maxSize) {
                return ResponseEntity.badRequest().body(Map.of("error", "File size must be less than 5MB. Current size: "
                        + (file.getSize() / 1024 / 1024) + "MB"));
            }

            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String filename = UUID.randomUUID().toString() + extension;

            Path uploadPath = Paths.get("uploads/properties");
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            Path filePath = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            String fileUrl = "/uploads/properties/" + filename;
            Map<String, String> response = new HashMap<>();
            response.put("url", fileUrl);
            response.put("filename", filename);
            response.put("message", "File uploaded successfully");

            return ResponseEntity.ok(response);

        } catch (IOException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to upload file: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    // @DeleteMapping("/delete-image")
    // public ResponseEntity<Map<String, String>> deleteImage(@RequestParam String filename) {
    //     try {
    //         Path filePath = Paths.get("uploads/properties").resolve(filename);
    //         if (Files.exists(filePath)) {
    //             Files.delete(filePath);
    //             return ResponseEntity.ok(Map.of("message", "File deleted successfully"));
    //         } else {
    //             return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "File not found"));
    //         }
    //     } catch (IOException e) {
    //         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Failed to delete file: " + e.getMessage()));
    //     }
    // }

    private boolean isValidImageType(String contentType) {
        return contentType != null
                && (contentType.equals("image/jpeg")
                || contentType.equals("image/jpg")
                || contentType.equals("image/png"));
    }
}
