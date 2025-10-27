package com.example.real_estate.service;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.example.real_estate.dto.PropertyDto;
import com.example.real_estate.exception.ResourceNotFoundException;
import com.example.real_estate.model.Property;
import com.example.real_estate.model.PropertyImage;
import com.example.real_estate.model.User;
import com.example.real_estate.repository.PropertyRepository;
import com.example.real_estate.repository.UserRepository;

@Service
public class PropertyService {

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ModelMapper modelMapper;

    // Create Property
    public PropertyDto createProperty(PropertyDto propertyDto) {
    if (propertyDto.getAgentId() == null) {
        throw new IllegalArgumentException("Agent ID is required to create a property");
    }
    Property property = modelMapper.map(propertyDto, Property.class);
    User agent = userRepository.findById(propertyDto.getAgentId())
        .orElseThrow(() -> new ResourceNotFoundException("Agent not found with id: " + propertyDto.getAgentId()));
    property.setAgent(agent);

    if (property.getImages() != null) {
        property.getImages().forEach(image -> {
            image.setProperty(property);
            image.setId(null);
        });
    }

    Property saved = propertyRepository.save(property);
    return modelMapper.map(saved, PropertyDto.class);
}

    // Update Property
    public PropertyDto updateProperty(Long id, PropertyDto propertyDto) {
        Property existingProperty = propertyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found with id: " + id));

        existingProperty.setTitle(propertyDto.getTitle());
        existingProperty.setDescription(propertyDto.getDescription());
        existingProperty.setPrice(propertyDto.getPrice());
        existingProperty.setArea(propertyDto.getArea());
        existingProperty.setAddress(propertyDto.getAddress());
        existingProperty.setLatitude(propertyDto.getLatitude());
        existingProperty.setLongitude(propertyDto.getLongitude());

        if (propertyDto.getAgentId() != null) {
            User agent = userRepository.findById(propertyDto.getAgentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Agent not found with id: " + propertyDto.getAgentId()));
            existingProperty.setAgent(agent);
        }

        List<PropertyImage> incomingImages = modelMapper.map(
                propertyDto.getImages(), new TypeToken<List<PropertyImage>>() {}.getType()
        );

        List<PropertyImage> dbImages = existingProperty.getImages();
        dbImages.clear();

        if (incomingImages != null) {
            for (PropertyImage img : incomingImages) {
                img.setProperty(existingProperty);
                dbImages.add(img);
            }
        }

        Property updated = propertyRepository.save(existingProperty);
        return modelMapper.map(updated, PropertyDto.class);
    }

    // Delete Property
    public ResponseEntity<Void> deleteProperty(Long id) {
        if (!propertyRepository.existsById(id)) {
            throw new ResourceNotFoundException("Property not found with id: " + id);
        }
        propertyRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // Get Property by ID
    public PropertyDto getPropertyById(Long id) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found with id: " + id));
        return modelMapper.map(property, PropertyDto.class);
    }

    // Get All Properties
    public List<PropertyDto> getAllProperties() {
        return propertyRepository.findAll()
                .stream()
                .map(property -> modelMapper.map(property, PropertyDto.class))
                .collect(Collectors.toList());
    }

    // Search by Title
    public List<PropertyDto> searchByTitle(String title) {
        List<Property> properties = propertyRepository.findByTitleContainingIgnoreCase(title);
        if (properties.isEmpty()) {
            throw new ResourceNotFoundException("No properties found with title containing: " + title);
        }
        return properties.stream()
                .map(p -> modelMapper.map(p, PropertyDto.class))
                .collect(Collectors.toList());
    }

    // Get Properties by Agent
    public List<PropertyDto> getPropertiesByAgentId(Long agentId) {
        List<Property> properties = propertyRepository.findByAgentId(agentId);
        return properties.stream()
                .map(property -> modelMapper.map(property, PropertyDto.class))
                .collect(Collectors.toList());
    }
}
