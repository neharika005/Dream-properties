package com.example.real_estate.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.real_estate.model.Favorite;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    List<Favorite> findByBuyer_Id(Long buyerId);
    Optional<Favorite> findByBuyer_IdAndProperty_Id(Long buyerId, Long propertyId);
}
