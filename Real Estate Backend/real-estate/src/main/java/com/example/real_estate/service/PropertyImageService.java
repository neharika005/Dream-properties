package com.example.real_estate.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import com.example.real_estate.dto.PropertyImageDto;
import com.example.real_estate.exception.ResourceNotFoundException;
import com.example.real_estate.model.Property;
import com.example.real_estate.model.PropertyImage;
import com.example.real_estate.model.User;
import com.example.real_estate.repository.PropertyImageRepository;
import com.example.real_estate.repository.PropertyRepository;

@Service
public class PropertyImageService {

    @Autowired
    private PropertyImageRepository imageRepository;

    @Autowired
    private PropertyRepository propertyRepository;

    //add image 
    public PropertyImageDto addImage(Long propertyId, PropertyImageDto imageDto) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found"));

        PropertyImage image = PropertyImage.builder()
                .imageUrl(imageDto.getImageUrl())
                .property(property)
                .build();

        PropertyImage saved = imageRepository.save(image);
        return new PropertyImageDto(saved.getId(), saved.getImageUrl());
    }

    //image by property id
    public List<PropertyImageDto> getImagesByPropertyId(Long propertyId) {
        if (!propertyRepository.existsById(propertyId)) {
            throw new ResourceNotFoundException("Property not found");
        }

        return imageRepository.findByProperty_Id(propertyId)
                .stream()
                .map(pi -> new PropertyImageDto(pi.getId(), pi.getImageUrl()))
                .collect(Collectors.toList());
    }
     //delete image 
    public void deleteImage(Long imageId, Long currentUserId) {
    PropertyImage image = imageRepository.findById(imageId)
                    .orElseThrow(() -> new ResourceNotFoundException("Image not found"));

    User agent = image.getProperty().getAgent();
    if (!agent.getId().equals(currentUserId)) {
        throw new AccessDeniedException("You are not authorized to delete this image");
    }
    imageRepository.delete(image);
}

     
    //image by id 
    public PropertyImageDto getImageById(Long imageId) {
        PropertyImage image = imageRepository.findById(imageId)
                .orElseThrow(() -> new ResourceNotFoundException("Image not found"));
        return new PropertyImageDto(image.getId(), image.getImageUrl());
    }

    //image by property name 
    public List<PropertyImageDto> getImagesByPropertyTitle(String title) {
        List<PropertyImage> images = imageRepository.findByProperty_Title(title);
        if (images.isEmpty()) {
            throw new ResourceNotFoundException("No images found for property title: " + title);
        }
        return images.stream()
                .map(pi -> new PropertyImageDto(pi.getId(), pi.getImageUrl()))
                .collect(Collectors.toList());
    }
}
