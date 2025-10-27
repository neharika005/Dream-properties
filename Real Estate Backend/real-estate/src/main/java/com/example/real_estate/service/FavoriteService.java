package com.example.real_estate.service;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.real_estate.dto.FavoriteDto;
import com.example.real_estate.dto.PropertyDto;
import com.example.real_estate.exception.DuplicateResourceException;
import com.example.real_estate.exception.ResourceNotFoundException;
import com.example.real_estate.model.Favorite;
import com.example.real_estate.model.Property;
import com.example.real_estate.model.User;
import com.example.real_estate.repository.FavoriteRepository;
import com.example.real_estate.repository.PropertyRepository;
import com.example.real_estate.repository.UserRepository;

@Service
public class FavoriteService {

    @Autowired
    private FavoriteRepository favoriteRepository;
    @Autowired
    private PropertyRepository propertyRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ModelMapper modelMapper;
         //add fav
    public FavoriteDto addFavorite(Long propertyId, Long buyerId) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found"));
        User buyer = userRepository.findById(buyerId)
                .orElseThrow(() -> new ResourceNotFoundException("Buyer not found"));
        favoriteRepository.findByBuyer_IdAndProperty_Id(buyerId, propertyId)
                .ifPresent(f -> { throw new DuplicateResourceException("Favorite already exists for this property"); });
        Favorite favorite = Favorite.builder()
                .property(property)
                .buyer(buyer)
                .build();
        Favorite saved = favoriteRepository.save(favorite);
        return FavoriteDto.builder()
                .id(saved.getId())
                .propertyId(saved.getProperty().getId())
                .buyerId(saved.getBuyer().getId())
                .message("Added to favorites")
                .build();
    }
     //remove fav
    public void removeFavoriteByBuyerAndProperty(Long buyerId, Long propertyId) {
        Favorite favorite = favoriteRepository.findByBuyer_IdAndProperty_Id(buyerId, propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Favorite not found"));
        favoriteRepository.delete(favorite);
    }

    //fav by buyer - TO TRACK 
    public List<FavoriteDto> getFavoritesByBuyer(Long buyerId) {
        return favoriteRepository.findByBuyer_Id(buyerId)
                .stream()
                .map(f -> FavoriteDto.builder()
                        .id(f.getId())
                        .propertyId(f.getProperty().getId())
                        .buyerId(f.getBuyer().getId())
                        .build())
                .collect(Collectors.toList());
    }

    // fav prop by buyer - FULL PROP DETAILS RETURN TO DISPLAY 
    public List<PropertyDto> getFavoritePropertiesByBuyer(Long buyerId) {
        List<Favorite> favorites = favoriteRepository.findByBuyer_Id(buyerId);
        return favorites.stream()
                .map(Favorite::getProperty)
                .map(property -> modelMapper.map(property, PropertyDto.class))
                .collect(Collectors.toList());
    }
}
